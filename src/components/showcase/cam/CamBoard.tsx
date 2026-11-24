import { CampaignScreen, Chat, PaymentScreen, Phone, ReportScreen, SignupForm, StudentsScreen } from './CamUi'
import styles from './CamBoard.module.css'

/**
 * Presentation image of Instituto CAM: a tilted grid of the panel's screens and the student's
 * phone (signup, WhatsApp), on the brand blue. It covers its box like `object-fit: cover`, so the
 * home card (square) and the case cover (half the screen, or 3:2 on phones) show the same board
 * and the view transition between them is a plain move.
 */
export function CamBoard({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`} role="img" aria-label={label}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.board}>
          <Phone className={styles.phone}>
            <SignupForm />
          </Phone>
          <StudentsScreen className={styles.screen} />
          <CampaignScreen className={styles.screen} />
          <Phone className={styles.phone}>
            <Chat />
          </Phone>
          <ReportScreen className={styles.screen} />
          <PaymentScreen className={styles.screen} />
        </div>
      </div>
    </div>
  )
}
