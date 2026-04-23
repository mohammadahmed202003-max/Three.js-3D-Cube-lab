import * as THREE from 'three'

export class SceneManager {
  constructor(mount) {
    this.mount = mount
    this._animId = null
    this._initScene()
    this._initRenderer()
    this._initLights()
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.mount.clientWidth / this.mount.clientHeight,
      0.1,
      1000
    )
    this.camera.position.z = 3
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
    this.renderer.domElement.style.display = 'block'
    this.mount.appendChild(this.renderer.domElement)
  }

  _initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    this.scene.add(pointLight)
  }

  add(object) {
    this.scene.add(object)
    return this
  }

  startAnimation(onFrame) {
    const loop = () => {
      this._animId = requestAnimationFrame(loop)
      onFrame()
      this.renderer.render(this.scene, this.camera)
    }
    loop()
  }

  stopAnimation() {
    if (this._animId) {
      cancelAnimationFrame(this._animId)
      this._animId = null
    }
  }

  get domElement() {
    return this.renderer.domElement
  }

  dispose() {
    this.stopAnimation()
    this.renderer.dispose()
    if (this.mount.contains(this.renderer.domElement)) {
      this.mount.removeChild(this.renderer.domElement)
    }
  }
}
