import styles from './TimerPanel.module.css'

/**
 * Reusable reaction-time display panel.
 *
 * @param {{ displayMs: number, isDone: boolean, pendingLabel?: string }} props
 */
function TimerPanel({ displayMs, isDone, pendingLabel = 'Click the cube' }) {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>REACTION TIME</div>
      <div className={styles.time} style={{ color: isDone ? '#27ae60' : '#c0392b' }}>
        {(displayMs / 1000).toFixed(2)}s
      </div>
      <div className={styles.sub} style={{ color: isDone ? '#3d8b57' : '#444' }}>
        {isDone ? '✓ Texture changed' : pendingLabel}
      </div>
    </div>
  )
}

export default TimerPanel
