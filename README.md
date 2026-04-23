# 🧪 HCI Lab — Fitts' Law Experiment 

> An interactive Human-Computer Interaction experiment built with **React** and **Three.js**, demonstrating Fitts' Law through two distinct target-acquisition tasks with real-time reaction time measurement.

---

## ✨ Features

- 🎯 **Two Fitts' Law experiments** — click a 3D cube vs click a button
- ⏱️ **Precision reaction timer** — millisecond accuracy
- 📐 **Animated measurement lines** — visual distance indicators between targets
- 🎨 **6 procedural textures** — generated upon clicking the cube or button
- 🔄 **Live 3D rendering** — smooth 60fps WebGL via Three.js
- 🏗️ **Clean OOP architecture** — SceneManager, Cube, and TextureManager as proper classes

---

## 🖥️ Preview

| Fitts Law Test 1 | Fitts Law Test 2 |
|---|---|
| Click the rotating 3D cube directly | Click a button below the cube |
| 1 measurement line (nav → cube) | 2 measurement lines (nav → cube → button) |
| Raycasting detects the 3D click | Standard HTML button click |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hci-lab.git

# Navigate into the project
cd hci-lab/my-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Structure

```
src/
├── hooks/
│   ├── useThreeScene.js         # Three.js lifecycle hook
│   └── useTimer.js              # Reaction timer hook
├── three/
│   ├── SceneManager.js          # Camera, renderer, lights
│   ├── Cube.js                  # 3D cube mesh + rotation
│   └── TextureManager.js        # 6 procedural canvas textures
└── components/
    ├── NavBar/                  # Top navigation bar
    ├── FittsTest1/              # Experiment 1 — click the cube
    ├── FittsTest2/              # Experiment 2 — click the button
    └── shared/
        ├── TimerPanel/          # Reusable reaction time display
        └── FittsLine/           # Reusable animated SVG line
```

---

## 🎨 The 6 Procedural Textures

All textures are **generated in JavaScript** at runtime — no image files used.

| # | Name | Description |
|---|---|---|
| 1 | 🌌 Cosmic | Purple/pink nebula gas clouds with 160 random stars |
| 2 | 🏎️ Carbon Fibre | Woven diagonal tile grid with iridescent sheen |
| 3 | 💻 Cyberpunk Circuit | Neon green circuit traces with glowing junction dots |
| 4 | 🌠 Galaxy | Deep space star field dense toward a bright galactic core |
| 5 | 🧊 Ice | Crystalline frost with recursive fractal dendrite branches |
| 6 | ⚡ Lightning | Fractal electric bolts with layered purple and white glow |

---

## 🧠 How Fitts' Law Works Here

**Fitts' Law** predicts that the time to move to a target depends on the distance to the target and the size of the target.

In this app:

- **Test 1** measures how long it takes to click directly on a moving 3D object
- **Test 2** measures how long it takes to click a static button after seeing the cube

The animated yellow dashed lines visualise the **distance** between each target — exactly what Fitts' Law is about.

---

## 🏗️ Architecture Highlights

### OOP 3D Layer

Three separate classes handle the 3D side with no React dependency:

```
SceneManager  →  owns the stage (scene, camera, renderer, lights)
Cube          →  owns the object (geometry, material, rotation, texture swap)
TextureManager →  owns the textures (generates and cycles all 6)
```

### React Layer

Custom hooks keep components thin and clean:

```
useThreeScene  →  mounts/unmounts the Three.js scene safely
useTimer       →  starts on mount, stops on click, gives precise ms
```

### Shared Components

```
TimerPanel  →  reused by both experiments (same UI, different label)
FittsLine   →  reused by both experiments (self-animating SVG overlay)
```

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Three.js](https://threejs.org/) | 3D WebGL rendering |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| CSS Modules | Scoped component styling |

---

## 📁 Key Design Decisions

- **No image assets** — every texture is drawn in code, keeping the bundle lean
- **CSS Modules** — every component has its own scoped stylesheet, zero class name conflicts
- **Barrel exports** (`index.js`) — clean imports without exposing internal folder structure
- **`--nav-height` CSS variable** — single source of truth for layout spacing across JS and CSS
- **`performance.now()`** — sub-millisecond timer precision instead of `Date.now()`

---

## 👨‍💻 Author

**Ahmed Siddiqui**
HCI Lab Assignment 

---

