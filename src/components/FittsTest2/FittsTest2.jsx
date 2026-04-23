import { useRef, useState, useEffect } from 'react'
import { Cube } from '../../three/Cube'
import { useThreeScene } from '../../hooks/useThreeScene'
import { useTimer } from '../../hooks/useTimer'
import TimerPanel from '../shared/TimerPanel/TimerPanel'
import FittsLine from '../shared/FittsLine/FittsLine'
import styles from './FittsTest2.module.css'

const NAV_HEIGHT = 48

function FittsTest2() {
  const mountRef = useRef(null)
  const btnRef = useRef(null)
  const cubeRef = useRef(null)
  const [linePos1, setLinePos1] = useState(null) // nav button → cube centre
  const [linePos2, setLinePos2] = useState(null) // cube centre → Change Texture button
  const { displayMs, isDone, stop } = useTimer()

  useThreeScene(mountRef, (manager) => {
    const cube = new Cube()
    manager.add(cube.getMesh())
    manager.startAnimation(() => cube.rotate())
    cubeRef.current = cube
    return () => cube.dispose()
  })

  useEffect(() => {
    const cubeX = window.innerWidth / 2
    const cubeY = (window.innerHeight + NAV_HEIGHT) / 2

    const navBtn = document.querySelector('[data-tab="fitts"]')
    if (navBtn) {
      const r = navBtn.getBoundingClientRect()
      setLinePos1({ x1: r.left + r.width / 2, y1: r.top + r.height / 2, x2: cubeX, y2: cubeY })
    }

    if (btnRef.current) {
      const b = btnRef.current.getBoundingClientRect()
      const btnCX = b.left + b.width / 2
      const btnCY = b.top + b.height / 2
      setLinePos2({ x1: cubeX, y1: cubeY, x2: btnCX, y2: btnCY })

}
  }, [])

  const handleBtnClick = () => {
    cubeRef.current?.onClick()

    stop()
  }

  return (
    <div className={styles.wrapper}>
      <div ref={mountRef} className={styles.canvas} />

      <div className={styles.btnWrapper}>
        <p className={styles.hint}>
          The button is your target — click it to change the cube&apos;s texture
        </p>
        <button ref={btnRef} className={styles.btn} onClick={handleBtnClick}>
          Change Texture
        </button>
      </div>

      {linePos1 && (
        <FittsLine
          x1={linePos1.x1} y1={linePos1.y1}
          x2={linePos1.x2} y2={linePos1.y2}
          markerId="arr-fitts1"
          delay={400}
          duration={1300}
        />
      )}
      {linePos2 && (
        <FittsLine
          x1={linePos2.x1} y1={linePos2.y1}
          x2={linePos2.x2} y2={linePos2.y2}
          markerId="arr-fitts2"
          delay={1900}
          duration={1300}
        />
      )}

      <TimerPanel displayMs={displayMs} isDone={isDone} pendingLabel="Click the button" />
    </div>
  )
}

export default FittsTest2
