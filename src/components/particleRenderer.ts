/**
 * Draws many small dots on a canvas. WebGL (`gl.POINTS`) when available, so
 * thousands of dots cost next to nothing per frame; canvas 2D otherwise.
 *
 * `dots` holds x, y (CSS px), alpha (0–1) and size (CSS px) for every dot.
 */
export interface DotRenderer {
  resize(width: number, height: number, dpr: number): void
  draw(dots: Float32Array, count: number): void
}

/** Floats per dot in the `dots` buffer. */
export const DOT_STRIDE = 4

const VERTEX_SHADER = `
attribute vec4 a_dot;
uniform vec2 u_view;
uniform float u_dpr;
varying float v_alpha;
void main() {
  vec2 clip = a_dot.xy / u_view * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(1.0, a_dot.w * u_dpr);
  v_alpha = a_dot.z;
}`

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 u_color;
varying float v_alpha;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = v_alpha * (1.0 - smoothstep(0.38, 0.5, r));
  gl_FragColor = vec4(u_color * a, a);
}`

/** Opacity levels of the 2D fallback (one fill style change per level). */
const FALLBACK_LEVELS = 12

/** `#rrggbb` → [r, g, b] in 0–1. */
function parseHex(color: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color.trim())
  if (!m) return [1, 1, 1]
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
}

function createGlRenderer(canvas: HTMLCanvasElement, color: string): DotRenderer | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false })
  if (!gl) return null

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
  }
  const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  const aDot = gl.getAttribLocation(program, 'a_dot')
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(aDot)
  gl.vertexAttribPointer(aDot, DOT_STRIDE, gl.FLOAT, false, 0, 0)

  const uView = gl.getUniformLocation(program, 'u_view')
  const uDpr = gl.getUniformLocation(program, 'u_dpr')
  gl.uniform3fv(gl.getUniformLocation(program, 'u_color'), parseHex(color))
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // premultiplied alpha
  gl.clearColor(0, 0, 0, 0)

  let capacity = 0
  return {
    resize(width, height, dpr) {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uView, width, height)
      gl.uniform1f(uDpr, dpr)
    },
    draw(dots, count) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (dots.length > capacity) {
        capacity = dots.length
        gl.bufferData(gl.ARRAY_BUFFER, capacity * 4, gl.DYNAMIC_DRAW)
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, dots.subarray(0, count * DOT_STRIDE))
      gl.drawArrays(gl.POINTS, 0, count)
    },
  }
}

function create2dRenderer(canvas: HTMLCanvasElement, color: string): DotRenderer | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  let w = 0
  let h = 0
  return {
    resize(width, height, dpr) {
      w = width
      h = height
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    },
    draw(dots, count) {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      for (let level = 0; level < FALLBACK_LEVELS; level++) {
        ctx.globalAlpha = (level + 0.5) / FALLBACK_LEVELS
        for (let i = 0; i < count; i++) {
          const j = i * DOT_STRIDE
          if (Math.min(FALLBACK_LEVELS - 1, Math.floor(dots[j + 2] * FALLBACK_LEVELS)) !== level) continue
          const d = dots[j + 3]
          ctx.fillRect(dots[j] - d / 2, dots[j + 1] - d / 2, d, d)
        }
      }
      ctx.globalAlpha = 1
    },
  }
}

export function createDotRenderer(canvas: HTMLCanvasElement, color: string): DotRenderer | null {
  return createGlRenderer(canvas, color) ?? create2dRenderer(canvas, color)
}
