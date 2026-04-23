import * as THREE from 'three'
import { TextureManager } from './TextureManager'

export class Cube {
  constructor() {
    this.textureManager = new TextureManager()

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })

    this.mesh = new THREE.Mesh(geometry, material)

    // Edge lines
    const edges = new THREE.EdgesGeometry(geometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
    this.edges = new THREE.LineSegments(edges, edgeMaterial)
    this.mesh.add(this.edges)
  }

  rotate() {
    this.mesh.rotation.x += 0.005
    this.mesh.rotation.y += 0.01
  }

  onClick() {
    const nextTexture = this.textureManager.next()
    this.mesh.material.color.set(0xffffff)
    this.mesh.material.map = nextTexture
    this.mesh.material.needsUpdate = true
  }

  getMesh() {
    return this.mesh
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.edges.geometry.dispose()
    this.edges.material.dispose()
    this.textureManager.dispose()
  }
}
