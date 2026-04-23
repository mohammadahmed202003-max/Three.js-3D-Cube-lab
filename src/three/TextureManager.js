import * as THREE from 'three'

export class TextureManager {
  constructor() {
    this.textures = this._createTextures()
    this.currentIndex = 0
  }

  _makeCanvas(size = 256) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    return { canvas, ctx: canvas.getContext('2d') }
  }

  _radialBlob(ctx, x, y, r, stops) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    stops.forEach(([t, c]) => g.addColorStop(t, c))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
  }

  // 1. Cosmic — purple/pink/blue nebula swirling gas
  _cosmic() {
    const { canvas, ctx } = this._makeCanvas()
    const s = 256, cx = s / 2, cy = s / 2

    ctx.fillStyle = '#060010'
    ctx.fillRect(0, 0, s, s)

    // Nebula gas blobs
    this._radialBlob(ctx, cx - 18, cy - 14, 105, [
      [0,   'rgba(130,0,200,0.65)'],
      [0.5, 'rgba(60,0,130,0.3)'],
      [1,   'rgba(0,0,0,0)'],
    ])
    this._radialBlob(ctx, cx + 32, cy + 22, 88, [
      [0,   'rgba(0,80,200,0.55)'],
      [0.5, 'rgba(0,40,110,0.22)'],
      [1,   'rgba(0,0,0,0)'],
    ])
    this._radialBlob(ctx, cx - 42, cy + 38, 72, [
      [0,   'rgba(200,0,120,0.45)'],
      [0.5, 'rgba(100,0,70,0.18)'],
      [1,   'rgba(0,0,0,0)'],
    ])
    this._radialBlob(ctx, cx + 22, cy - 42, 65, [
      [0,   'rgba(0,160,210,0.38)'],
      [0.5, 'rgba(0,70,130,0.14)'],
      [1,   'rgba(0,0,0,0)'],
    ])
    this._radialBlob(ctx, cx + 58, cy - 18, 52, [
      [0,   'rgba(180,60,255,0.32)'],
      [0.6, 'rgba(80,0,140,0.1)'],
      [1,   'rgba(0,0,0,0)'],
    ])

    // Stars
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * s
      const y = Math.random() * s
      const r = Math.random() * 1.3 + 0.2
      const b = Math.random()
      ctx.fillStyle = b > 0.88 ? '#ffffff' : `rgba(210,190,255,${0.25 + b * 0.65})`
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }

    // Bright core
    this._radialBlob(ctx, cx, cy, 42, [
      [0,   'rgba(255,255,255,0.92)'],
      [0.2, 'rgba(230,160,255,0.85)'],
      [0.6, 'rgba(130,0,220,0.4)'],
      [1,   'rgba(0,0,0,0)'],
    ])

    // Vignette
    this._radialBlob(ctx, cx, cy, s * 0.72, [
      [0.35, 'rgba(0,0,0,0)'],
      [1,    'rgba(2,0,10,0.88)'],
    ])

    return new THREE.CanvasTexture(canvas)
  }

  // 2. Carbon Fibre — realistic woven diagonal weave
  _carbonFibre() {
    const { canvas, ctx } = this._makeCanvas(512)
    const s = 512
    const tile = 16  // size of each fibre bundle

    // Each 2x1 block of tiles forms one weave unit
    for (let row = 0; row < s / tile; row++) {
      for (let col = 0; col < s / tile; col++) {
        const x = col * tile
        const y = row * tile
        const isEven = (col + row) % 2 === 0

        // Alternate fibre direction per tile
        const grad = isEven
          ? ctx.createLinearGradient(x, y, x + tile, y + tile)
          : ctx.createLinearGradient(x + tile, y, x, y + tile)

        // Each fibre has a highlight (bright centre) and dark edges
        grad.addColorStop(0,    '#1a1a1a')
        grad.addColorStop(0.25, '#2e2e2e')
        grad.addColorStop(0.5,  '#3d3d3d')   // highlight
        grad.addColorStop(0.75, '#252525')
        grad.addColorStop(1,    '#141414')

        ctx.fillStyle = grad
        ctx.fillRect(x, y, tile, tile)

        // Subtle cross-weave groove lines between bundles
        ctx.strokeStyle = 'rgba(0,0,0,0.75)'
        ctx.lineWidth = 1
        ctx.strokeRect(x + 0.5, y + 0.5, tile - 1, tile - 1)
      }
    }

    // Second pass — horizontal weave rows shift by half tile for interlocking look
    for (let row = 0; row < s / tile; row++) {
      for (let col = 0; col < s / tile; col++) {
        const x = col * tile
        const y = row * tile
        // Overlay a very subtle row-stripe to reinforce the over-under weave
        const rowParity = row % 2
        const colParity = col % 2
        if (rowParity === colParity) {
          ctx.fillStyle = 'rgba(255,255,255,0.025)'
          ctx.fillRect(x, y, tile, tile)
        }
      }
    }

    // Subtle blue-grey sheen overlay (carbon fibre has a slight iridescent sheen)
    const sheen = ctx.createLinearGradient(0, 0, s, s)
    sheen.addColorStop(0,   'rgba(80,100,140,0.08)')
    sheen.addColorStop(0.5, 'rgba(120,140,180,0.04)')
    sheen.addColorStop(1,   'rgba(60,80,120,0.08)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, s, s)

    // Top-left directional highlight (light catching the surface)
    const highlight = ctx.createLinearGradient(0, 0, s * 0.6, s * 0.6)
    highlight.addColorStop(0,   'rgba(255,255,255,0.06)')
    highlight.addColorStop(0.5, 'rgba(255,255,255,0.02)')
    highlight.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = highlight
    ctx.fillRect(0, 0, s, s)

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 2)
    return tex
  }

  // 3. Cyberpunk Circuit — black with neon green circuit traces
  _cyberpunkCircuit() {
    const { canvas, ctx } = this._makeCanvas()
    const s = 256

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, s, s)

    // Draw a circuit trace segment
    const trace = (x1, y1, x2, y2, color, blur, lw) => {
      ctx.shadowColor = color; ctx.shadowBlur = blur
      ctx.strokeStyle = color; ctx.lineWidth = lw
      ctx.lineCap = 'square'
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
    }

    // Main neon green traces
    const g = 'rgba(0,255,65,0.88)'
    const gd = [
      [0, 48, 80, 48], [80, 48, 80, 80], [80, 80, 180, 80],
      [180, 80, 180, 32], [180, 32, 256, 32],
      [0, 128, 48, 128], [48, 128, 48, 160], [48, 160, 130, 160],
      [130, 160, 130, 96], [130, 96, 210, 96], [210, 96, 210, 64], [210, 64, 256, 64],
      [0, 192, 96, 192], [96, 192, 96, 224], [96, 224, 160, 224],
      [160, 224, 160, 176], [160, 176, 256, 176],
      [0, 16, 256, 16], [0, 240, 256, 240],
      [16, 0, 16, 256], [240, 0, 240, 256],
      [0, 112, 256, 112],
    ]
    for (const [x1, y1, x2, y2] of gd) trace(x1, y1, x2, y2, g, 7, 1.5)

    // Cyan accent traces
    const c = 'rgba(0,220,255,0.55)'
    for (const [x1, y1, x2, y2] of [[0, 144, 256, 144], [112, 0, 112, 256], [144, 0, 144, 256]])
      trace(x1, y1, x2, y2, c, 5, 0.8)

    // Orange accent traces
    const o = 'rgba(255,120,0,0.5)'
    for (const [x1, y1, x2, y2] of [[0, 64, 48, 64], [48, 64, 48, 0], [256, 192, 200, 192], [200, 192, 200, 256]])
      trace(x1, y1, x2, y2, o, 6, 1.2)

    // Junction dots
    ctx.shadowColor = 'rgba(0,255,65,1)'; ctx.shadowBlur = 12
    ctx.fillStyle = 'rgba(0,255,65,1)'
    for (const [x, y] of [
      [80, 48], [80, 80], [180, 80], [180, 32], [48, 128], [48, 160],
      [130, 160], [130, 96], [210, 96], [210, 64], [96, 192], [96, 224],
      [160, 224], [160, 176], [16, 16], [240, 16], [16, 240], [240, 240],
      [128, 16], [128, 112], [16, 112], [240, 112], [128, 144],
    ]) {
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill()
    }

    ctx.shadowBlur = 0
    return new THREE.CanvasTexture(canvas)
  }

  // 4. Galaxy — deep space with star clusters and core
  _galaxy() {
    const { canvas, ctx } = this._makeCanvas()
    const s = 256, cx = s / 2, cy = s / 2

    ctx.fillStyle = '#00010d'
    ctx.fillRect(0, 0, s, s)

    // Spiral arm glow
    this._radialBlob(ctx, cx - 28, cy - 14, 92, [[0, 'rgba(40,60,155,0.52)'], [0.6, 'rgba(15,25,80,0.15)'], [1, 'rgba(0,0,0,0)']])
    this._radialBlob(ctx, cx + 34, cy + 22, 80, [[0, 'rgba(30,50,140,0.42)'], [0.6, 'rgba(12,20,70,0.12)'], [1, 'rgba(0,0,0,0)']])
    this._radialBlob(ctx, cx - 10, cy + 42, 68, [[0, 'rgba(20,80,160,0.36)'], [0.6, 'rgba(8,30,80,0.1)'],  [1, 'rgba(0,0,0,0)']])
    this._radialBlob(ctx, cx + 22, cy - 40, 62, [[0, 'rgba(50,30,120,0.32)'], [0.6, 'rgba(20,10,60,0.08)'], [1, 'rgba(0,0,0,0)']])

    // Stars — dense toward center
    for (let i = 0; i < 320; i++) {
      const x = Math.random() * s
      const y = Math.random() * s
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (dist > 105 && Math.random() > 0.38) continue
      const r = Math.random() * 1.5 + 0.1
      const b = Math.random()
      ctx.fillStyle = b > 0.9
        ? '#ffffff'
        : `rgba(${180 + Math.floor(Math.random() * 75)},${185 + Math.floor(Math.random() * 70)},255,${0.28 + b * 0.7})`
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }

    // Bright galactic core
    this._radialBlob(ctx, cx, cy, 38, [
      [0,   'rgba(255,255,255,0.95)'],
      [0.2, 'rgba(210,215,255,0.85)'],
      [0.5, 'rgba(80,100,210,0.5)'],
      [1,   'rgba(0,0,0,0)'],
    ])

    // Vignette
    this._radialBlob(ctx, cx, cy, s * 0.7, [
      [0.38, 'rgba(0,0,0,0)'],
      [1,    'rgba(0,0,8,0.88)'],
    ])

    return new THREE.CanvasTexture(canvas)
  }

  // 5. Ice — crystalline frost with dendrite branches
  _ice() {
    const { canvas, ctx } = this._makeCanvas()
    const s = 256, cx = s / 2, cy = s / 2

    // Ice blue-white base
    const bg = ctx.createLinearGradient(0, 0, s, s)
    bg.addColorStop(0, '#cce8ff')
    bg.addColorStop(0.5, '#e8f6ff')
    bg.addColorStop(1, '#b8dcf5')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, s, s)

    // Internal depth
    this._radialBlob(ctx, cx - 18, cy - 14, 130, [
      [0,   'rgba(255,255,255,0.9)'],
      [0.4, 'rgba(180,228,255,0.7)'],
      [0.8, 'rgba(80,160,220,0.5)'],
      [1,   'rgba(20,80,160,0.7)'],
    ])

    // Frost dendrite branches
    const branch = (x, y, angle, len, depth) => {
      if (depth === 0 || len < 3) return
      const ex = x + Math.cos(angle) * len
      const ey = y + Math.sin(angle) * len
      ctx.strokeStyle = `rgba(255,255,255,${0.12 + depth * 0.11})`
      ctx.lineWidth = depth * 0.45
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
      branch(ex, ey, angle - 0.48, len * 0.64, depth - 1)
      branch(ex, ey, angle + 0.48, len * 0.64, depth - 1)
      if (depth > 3) branch(ex, ey, angle, len * 0.72, depth - 1)
    }

    ctx.lineCap = 'round'
    for (let i = 0; i < 6; i++) branch(cx, cy, (i / 6) * Math.PI * 2, 68, 5)

    // Corner frost clusters
    for (const [x, y] of [[20, 20], [236, 20], [20, 236], [236, 236], [128, 14], [14, 128]]) {
      for (let i = 0; i < 4; i++) branch(x, y, (i / 4) * Math.PI * 2, 22, 3)
    }

    // White translucent core
    this._radialBlob(ctx, cx, cy, 44, [
      [0,   'rgba(255,255,255,0.96)'],
      [0.3, 'rgba(225,242,255,0.72)'],
      [0.7, 'rgba(160,210,240,0.32)'],
      [1,   'rgba(0,0,0,0)'],
    ])

    // Deep blue edge (ice thickness)
    this._radialBlob(ctx, cx, cy, s * 0.7, [
      [0.3, 'rgba(0,0,0,0)'],
      [1,   'rgba(10,50,120,0.72)'],
    ])

    return new THREE.CanvasTexture(canvas)
  }

  // 6. Lightning — dark stormy sky with electric fractal bolts
  _lightning() {
    const { canvas, ctx } = this._makeCanvas()
    const s = 256, cx = s / 2, cy = s / 2

    ctx.fillStyle = '#04030c'
    ctx.fillRect(0, 0, s, s)

    // Storm clouds
    for (const [x, y, r] of [[cx - 24, cy - 18, 92], [cx + 30, cy + 14, 76], [cx - 38, cy + 34, 64], [cx + 50, cy - 28, 55]]) {
      this._radialBlob(ctx, x, y, r, [
        [0,   'rgba(38,28,68,0.62)'],
        [0.6, 'rgba(18,13,38,0.28)'],
        [1,   'rgba(0,0,0,0)'],
      ])
    }

    // Fractal bolt renderer
    const bolt = (x1, y1, x2, y2, depth) => {
      if (depth === 0) {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
        return
      }
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 22 * depth
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 22 * depth
      bolt(x1, y1, mx, my, depth - 1)
      bolt(mx, my, x2, y2, depth - 1)
      if (depth > 1 && Math.random() > 0.52) {
        const bx = mx + (Math.random() - 0.5) * 55
        const by = my + Math.random() * 38
        bolt(mx, my, bx, by, depth - 2)
      }
    }

    ctx.lineCap = 'round'

    // Outer purple glow
    ctx.shadowColor = '#9966ff'; ctx.shadowBlur = 22
    ctx.strokeStyle = 'rgba(140,110,255,0.38)'; ctx.lineWidth = 5
    bolt(cx - 18, 8, cx + 12, s - 8, 4)
    bolt(cx + 28, 8, cx - 8, s - 8, 3)

    // Mid glow
    ctx.shadowColor = '#ccbbff'; ctx.shadowBlur = 12
    ctx.strokeStyle = 'rgba(200,190,255,0.68)'; ctx.lineWidth = 1.8
    bolt(cx - 18, 8, cx + 12, s - 8, 3)

    // Bright white-blue core bolt
    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 7
    ctx.strokeStyle = 'rgba(255,255,255,0.96)'; ctx.lineWidth = 0.9
    bolt(cx - 18, 8, cx + 12, s - 8, 2)

    ctx.shadowBlur = 0

    // Flash ambient glow
    this._radialBlob(ctx, cx, cy, 85, [
      [0,   'rgba(180,170,255,0.22)'],
      [0.55, 'rgba(80,70,180,0.08)'],
      [1,   'rgba(0,0,0,0)'],
    ])

    // Vignette
    this._radialBlob(ctx, cx, cy, s * 0.7, [
      [0.28, 'rgba(0,0,0,0)'],
      [1,    'rgba(0,0,5,0.88)'],
    ])

    return new THREE.CanvasTexture(canvas)
  }

  _createTextures() {
    return [
      this._cosmic(),
      this._carbonFibre(),
      this._cyberpunkCircuit(),
      this._galaxy(),
      this._ice(),
      this._lightning(),
    ]
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.textures.length
    return this.textures[this.currentIndex]
  }

  dispose() {
    this.textures.forEach(t => t.dispose())
  }
}
