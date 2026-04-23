import { useEffect } from 'react'
import { SceneManager } from '../three/SceneManager'

/**
 * Initialises a Three.js scene on mount and tears it down on unmount.
 *
 * @param {React.RefObject} mountRef - ref attached to the mount <div>
 * @param {(manager: SceneManager) => ((() => void) | void)} setupFn
 *   Called once after the SceneManager is ready.
 *   Return an optional cleanup function for any extra teardown (e.g. event listeners, cube.dispose()).
 */
export function useThreeScene(mountRef, setupFn) {
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const manager = new SceneManager(mount)
    const extraCleanup = setupFn(manager)

    return () => {
      if (typeof extraCleanup === 'function') extraCleanup()
      manager.dispose()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
