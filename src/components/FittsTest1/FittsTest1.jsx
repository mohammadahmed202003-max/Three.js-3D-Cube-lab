import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Cube } from '../../three/Cube'
import { useThreeScene } from '../../hooks/useThreeScene'
import { useTimer } from '../../hooks/useTimer'
import TimerPanel from '../shared/TimerPanel/TimerPanel'
import FittsLine from '../shared/FittsLine/FittsLine'
import styles from './FittsTest1.module.css'

const NAV_HEIGHT = 48

function FittsTest1() {
  const mountRef = useRef(null)
  const [linePos, setLinePos] = useState(null)
  const { displayMs, isDone, stop } = useTimer()

  useThreeScene(mountRef, (manager) => {
    const cube = new Cube()
    manager.add(cube.getMesh())
    manager.startAnimation(() => cube.rotate())

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleClick = (e) => {
      const rect = manager.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, manager.camera)
      const intersects = raycaster.intersectObject(cube.getMesh(), false)
      if (intersects.length > 0) {
        cube.onClick()
        stop()
      }
    }

    manager.domElement.addEventListener('click', handleClick)

    return () => {
      manager.domElement.removeEventListener('click', handleClick)
      cube.dispose()
    }
  })

  useEffect(() => {
    const navBtn = document.querySelector('[data-tab="cube"]')
    if (navBtn) {
      const r = navBtn.getBoundingClientRect()
      setLinePos({
        x1: r.left + r.width / 2,
        y1: r.top + r.height / 2,
        x2: window.innerWidth / 2,
        y2: (window.innerHeight + NAV_HEIGHT) / 2,
      })
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div ref={mountRef} className={styles.canvas} />
      {linePos && (
        <FittsLine
          x1={linePos.x1} y1={linePos.y1}
          x2={linePos.x2} y2={linePos.y2}
          markerId="arr-cube"
          delay={400}
          duration={1400}
        />
      )}
      <TimerPanel displayMs={displayMs} isDone={isDone} pendingLabel="Click the cube" />
    </div>
  )
}

export default FittsTest1
