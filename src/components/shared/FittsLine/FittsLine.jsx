import { useEffect, useRef, useState } from 'react'
import styles from './FittsLine.module.css'

/**
 * Renders an animated dashed measurement line as a fixed SVG overlay.
 * Manages its own animation progress internally.
 *
 * @param {{
 *   x1: number, y1: number,
 *   x2: number, y2: number,
 *   markerId: string,
 *   delay?: number,
 *   duration?: number
 * }} props
 */
function FittsLine({ x1, y1, x2, y2, markerId, delay = 400, duration = 1400 }) {
  const [progress, setProgress] = useState(0)
  const animRef = useRef(null)

  useEffect(() => {
    const animStart = performance.now()
    const step = () => {
      const t = performance.now() - animStart
      if (t < delay) {
        animRef.current = requestAnimationFrame(step)
        return
      }
      const p = Math.min((t - delay) / duration, 1)
      setProgress(p)
      if (p < 1) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [delay, duration])

  const ex = x1 + (x2 - x1) * progress
  const ey = y1 + (y2 - y1) * progress
  const dist = Math.round(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))
  const mx = (x1 + ex) / 2
  const my = (y1 + ey) / 2

  return (
    <svg className={styles.overlay}>
      <defs>
        <marker id={markerId} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,200,50,0.85)" />
        </marker>
      </defs>

      <line
        x1={x1} y1={y1} x2={ex} y2={ey}
        stroke="rgba(255,200,50,0.7)"
        strokeWidth="1.5"
        strokeDasharray="7 4"
        markerEnd={progress >= 0.98 ? `url(#${markerId})` : undefined}
      />

      <circle cx={x1} cy={y1} r="4" fill="rgba(255,200,50,0.95)" />

      {progress > 0.04 && (
        progress >= 1
          ? <circle cx={x2} cy={y2} r="5" fill="rgba(255,200,50,0.95)" className="fitts-pulse" />
          : <circle cx={ex} cy={ey} r="4" fill="rgba(255,200,50,0.9)" />
      )}

      {progress > 0.35 && (
        <>
          <rect x={mx - 32} y={my - 12} width="64" height="22" rx="5" fill="rgba(0,0,0,0.7)" />
          <text
            x={mx} y={my + 5}
            textAnchor="middle"
            fill="rgba(255,200,50,1)"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {dist}px
          </text>
        </>
      )}
    </svg>
  )
}

export default FittsLine
