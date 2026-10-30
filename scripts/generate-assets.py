#!/usr/bin/env python3
"""
Generates every placeholder asset used by the site into /public/assets.

  - hero-seq/frame_###.webp   60-frame image sequence of a dark 3D object (replaces the reference canvas sequence)
  - videos/project-0N.mp4+jpg 5 looping abstract videos + posters (replace with your project reels)
  - insights/insight-0N.webp  4 article thumbnails
  - awards/award-*.webp       3 award plaques
  - logos/*.svg               6 client wordmarks + review platform badge

Requires: Pillow, numpy, ffmpeg (for the videos).
"""
import math
import os
import random
import shutil
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets")
random.seed(7)


def ensure(path):
    os.makedirs(path, exist_ok=True)
    return path


def font(size):
    for cand in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]:
        if os.path.exists(cand):
            return ImageFont.truetype(cand, size)
    return ImageFont.load_default()


# ---------------------------------------------------------------------------
# Tiny software 3D renderer (painter's algorithm, flat shading)
# ---------------------------------------------------------------------------
def box(cx, cy, cz, sx, sy, sz):
    """Returns list of quads (4 vertices each) for an axis-aligned box."""
    x0, x1 = cx - sx / 2, cx + sx / 2
    y0, y1 = cy - sy / 2, cy + sy / 2
    z0, z1 = cz - sz / 2, cz + sz / 2
    v = np.array(
        [
            [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
            [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
        ]
    )
    faces = [
        [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
        [2, 6, 7, 3], [1, 5, 6, 2], [0, 3, 7, 4],
    ]
    return [v[f] for f in faces]


def cylinder(cx, cy, cz, r, h, axis="y", n=28):
    quads = []
    ring = []
    for i in range(n):
        a = 2 * math.pi * i / n
        ring.append((math.cos(a) * r, math.sin(a) * r))
    for i in range(n):
        a0 = ring[i]
        a1 = ring[(i + 1) % n]
        if axis == "y":
            p = [
                [cx + a0[0], cy - h / 2, cz + a0[1]],
                [cx + a1[0], cy - h / 2, cz + a1[1]],
                [cx + a1[0], cy + h / 2, cz + a1[1]],
                [cx + a0[0], cy + h / 2, cz + a0[1]],
            ]
        else:  # axis z
            p = [
                [cx + a0[0], cy + a0[1], cz - h / 2],
                [cx + a1[0], cy + a1[1], cz - h / 2],
                [cx + a1[0], cy + a1[1], cz + h / 2],
                [cx + a0[0], cy + a0[1], cz + h / 2],
            ]
        quads.append(np.array(p))
    # caps
    if axis == "y":
        top = np.array([[cx + x, cy + h / 2, cz + z] for x, z in ring])
        bot = np.array([[cx + x, cy - h / 2, cz + z] for x, z in ring][::-1])
    else:
        top = np.array([[cx + x, cy + y, cz + h / 2] for x, y in ring])
        bot = np.array([[cx + x, cy + y, cz - h / 2] for x, y in ring][::-1])
    quads += [top, bot]
    return quads


def rot_y(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rot_x(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def rot_z(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def render_object(polys, size, angle_y, tilt=0.35, roll=0.6, base=(22, 22, 24), ambient=0.3):
    """Render polygon soup rotated by angle_y onto a black square image."""
    img = Image.new("RGB", (size, size), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    R = rot_x(tilt) @ rot_y(angle_y) @ rot_z(roll)
    light = np.array([-0.5, 0.8, -0.6])
    light /= np.linalg.norm(light)
    cam_dist = 6.5
    f = size * 1.55
    items = []
    for poly in polys:
        p = poly @ R.T
        p[:, 2] += cam_dist
        n = np.cross(p[1] - p[0], p[2] - p[0])
        if np.linalg.norm(n) == 0:
            continue
        n /= np.linalg.norm(n)
        # back-face culling (camera looks down +z)
        view = p.mean(axis=0)
        if np.dot(n, view) > 0:
            continue
        shade = ambient + (1 - ambient) * max(0.0, np.dot(n, -light * -1))
        shade = ambient + (1 - ambient) * max(0.0, float(np.dot(n, light)))
        col = tuple(int(min(255, c * (0.35 + shade * 2.0))) for c in base)
        pts = [(size / 2 + f * x / z, size / 2 + f * y / z) for x, y, z in p]
        items.append((view[2], pts, col))
    items.sort(key=lambda it: -it[0])
    for _, pts, col in items:
        draw.polygon(pts, fill=col)
    return img


def hero_sequence(frames=60, size=1080):
    out = ensure(os.path.join(OUT, "hero-seq"))
    # abstract "x" mark: two crossed slabs + a short cylinder on one tip
    polys = []
    polys += [q @ rot_z(math.radians(28)).T for q in box(0, 0, 0, 3.2, 0.9, 0.9)]
    polys += [q @ rot_z(math.radians(-62)).T for q in box(0, 0, 0, 3.2, 0.9, 0.9)]
    polys += cylinder(-1.35, 0.95, 0, 0.62, 0.55, axis="z")
    for i in range(frames):
        a = 2 * math.pi * i / frames
        img = render_object(polys, size, a)
        img = img.filter(ImageFilter.GaussianBlur(0.6))
        img.save(os.path.join(out, f"frame_{i + 1:03d}.webp"), quality=78, method=4)
    print(f"hero sequence: {frames} frames -> {out}")


# ---------------------------------------------------------------------------
# Abstract still images (insights, posters)
# ---------------------------------------------------------------------------
PALETTES = [
    ((20, 10, 40), (120, 40, 90)),
    ((10, 25, 60), (40, 110, 160)),
    ((35, 10, 10), (170, 60, 40)),
    ((10, 35, 30), (40, 150, 110)),
    ((25, 25, 25), (120, 120, 120)),
]


def gradient(w, h, c0, c1, angle_deg=35):
    x = np.linspace(0, 1, w)[None, :]
    y = np.linspace(0, 1, h)[:, None]
    a = math.radians(angle_deg)
    t = (x * math.cos(a) + y * math.sin(a))
    t = (t - t.min()) / (t.max() - t.min())
    arr = np.zeros((h, w, 3), dtype=np.float32)
    for k in range(3):
        arr[..., k] = c0[k] + (c1[k] - c0[k]) * t
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def abstract_scene(w, h, palette, seed, phase=0.0, label=None):
    rnd = random.Random(seed)
    img = gradient(w, h, *palette, angle_deg=rnd.uniform(20, 70))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(6):
        r = rnd.uniform(0.12, 0.38) * min(w, h)
        cx = (rnd.random() + 0.25 * math.sin(phase * 2 * math.pi + i)) * w
        cy = (rnd.random() + 0.18 * math.cos(phase * 2 * math.pi + i * 1.7)) * h
        tone = rnd.choice([(255, 255, 255, 38), (0, 0, 0, 90), (255, 255, 255, 18)])
        if i % 2:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=tone)
        else:
            ang = phase * 360 + i * 37
            box_img = Image.new("RGBA", (int(r * 2), int(r * 1.2)), tone)
            box_img = box_img.rotate(ang, expand=True)
            layer.alpha_composite(box_img, (int(cx - box_img.width / 2), int(cy - box_img.height / 2)))
    layer = layer.filter(ImageFilter.GaussianBlur(min(w, h) * 0.02))
    img = Image.alpha_composite(img.convert("RGBA"), layer)
    # soft vignette
    vig = Image.new("L", (w, h), 0)
    ImageDraw.Draw(vig).ellipse([-w * 0.2, -h * 0.2, w * 1.2, h * 1.2], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(min(w, h) * 0.25))
    dark = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    img = Image.composite(img, dark, vig)
    if label:
        d2 = ImageDraw.Draw(img)
        f = font(int(h * 0.05))
        d2.text((w * 0.04, h * 0.88), label, font=f, fill=(255, 255, 255, 170))
    return img.convert("RGB")


def insights_images():
    out = ensure(os.path.join(OUT, "insights"))
    for i in range(4):
        img = abstract_scene(720, 440, PALETTES[i], seed=100 + i)
        img.save(os.path.join(out, f"insight-{i + 1:02d}.webp"), quality=80)
    print("insights images -> ", out)


def award_images():
    out = ensure(os.path.join(OUT, "awards"))
    names = ["webby", "awwwards", "cssda"]
    for idx, name in enumerate(names):
        size = 420
        polys = []
        for k in range(3):
            polys += [q @ rot_z(math.radians(15 * k - 15)).T for q in box(-0.9 + k * 0.9, 0.3 - k * 0.35, k * 0.4, 1.1, 1.4, 0.18)]
        img = render_object(polys, size, 0.5 + idx * 0.3, tilt=0.2, roll=0.1, base=(118, 118, 124), ambient=0.3)
        img = img.filter(ImageFilter.GaussianBlur(0.5))
        img.save(os.path.join(out, f"award-{name}.webp"), quality=80)
    print("award images -> ", out)


# ---------------------------------------------------------------------------
# Videos
# ---------------------------------------------------------------------------
def project_videos(count=5, w=1280, h=776, seconds=4, fps=24):
    out = ensure(os.path.join(OUT, "videos"))
    if not shutil.which("ffmpeg"):
        print("ffmpeg not found — skipping videos")
        return
    tmp = ensure(os.path.join(ROOT, ".asset-tmp"))
    for i in range(count):
        frames = seconds * fps
        fdir = ensure(os.path.join(tmp, f"v{i}"))
        for fr in range(frames):
            phase = fr / frames  # 0..1 loops seamlessly
            img = abstract_scene(w, h, PALETTES[i % len(PALETTES)], seed=300 + i, phase=phase, label=f"PROJECT {i + 1:02d} — PLACEHOLDER REEL")
            img.save(os.path.join(fdir, f"{fr:04d}.jpg"), quality=85)
            if fr == 0:
                img.save(os.path.join(out, f"project-{i + 1:02d}.jpg"), quality=80)
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps),
                "-i", os.path.join(fdir, "%04d.jpg"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-movflags", "+faststart",
                os.path.join(out, f"project-{i + 1:02d}.mp4"),
            ],
            check=True,
        )
        shutil.rmtree(fdir)
        print(f"video {i + 1} -> {out}")
    shutil.rmtree(tmp, ignore_errors=True)


# ---------------------------------------------------------------------------
# Logos (SVG wordmarks)
# ---------------------------------------------------------------------------
def logos():
    out = ensure(os.path.join(OUT, "logos"))
    names = ["cadence", "orbit tower", "webflow", "northline", "relief network", "lumen"]
    for i, n in enumerate(names):
        weight = ["300", "400", "700", "400", "300", "500"][i]
        spacing = ["0.25em", "0.3em", "0", "0.08em", "0.12em", "0.35em"][i]
        style = ["italic" if i == 2 else "normal"][0]
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 220 48">
  <text x="110" y="31" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="22" font-weight="{weight}" font-style="{style}" letter-spacing="{spacing}" fill="#9a9898">{n}</text>
</svg>"""
        with open(os.path.join(out, f"client-{i + 1:02d}.svg"), "w") as fh:
            fh.write(svg)
    badge = """<svg xmlns="http://www.w3.org/2000/svg" width="70" height="21" viewBox="0 0 70 21">
  <rect x="0.5" y="0.5" width="69" height="20" rx="4" fill="none" stroke="#9a9898"/>
  <text x="35" y="14.5" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="10" letter-spacing="0.12em" fill="#d2cfcf">REVIEWS</text>
</svg>"""
    with open(os.path.join(out, "review-platform.svg"), "w") as fh:
        fh.write(badge)
    print("logos -> ", out)


if __name__ == "__main__":
    only = sys.argv[1:] or ["hero", "insights", "awards", "videos", "logos"]
    if "hero" in only:
        hero_sequence()
    if "insights" in only:
        insights_images()
    if "awards" in only:
        award_images()
    if "logos" in only:
        logos()
    if "videos" in only:
        project_videos()
    print("done")
