# 3D Car Configurator — Cowork Task List

## Project Overview

We're building a **"PCPartPicker for cars"** — a web platform where users can view cars in real-time 3D, swap aftermarket parts, get cost estimates, and save/share builds.

**Current state:** MVP frontend is built and functional at `app/`. The app uses React + Vite + Three.js (React Three Fiber) + Zustand. It currently has placeholder 3D geometry instead of real car models.

## Tech Stack

- **Frontend:** React 18, Vite, Three.js, React Three Fiber, @react-three/drei
- **State:** Zustand
- **Styling:** Vanilla CSS (dark theme, CSS variables)
- **Build format for 3D:** GLB/glTF (binary glTF)

---

## Architecture Reference

```
app/
├── src/
│   ├── components/
│   │   ├── CarViewer.jsx       # 3D viewport (Three.js canvas, orbit controls)
│   │   ├── CarSelector.jsx     # Left sidebar vehicle picker
│   │   ├── PartSelector.jsx    # Right sidebar parts catalog w/ fitment badges
│   │   ├── CostPanel.jsx       # Build cost breakdown
│   │   └── SavedBuilds.jsx     # Saved builds list
│   ├── data/
│   │   ├── cars.js             # Vehicle database (5 cars, specs, modSlots)
│   │   └── parts.js            # Aftermarket parts catalog (16 parts, 7 categories)
│   ├── utils/
│   │   ├── fitment.js          # Rule-based fitment validation engine
│   │   └── costCalculator.js   # Cost breakdown calculator
│   ├── store/
│   │   └── useStore.js         # Zustand global state
│   ├── App.jsx                 # Root layout (3-column grid)
│   └── App.css                 # All styling
├── public/                     # Static assets
└── index.html
```

---

## TASK LIST FOR COWORK

Work through these tasks in order. Each task is self-contained. Commit after completing each one.

---

### Task 1: Integrate GLB Model Loading into CarViewer

**Goal:** Replace the placeholder box car with real GLB model loading.

**File to edit:** `app/src/components/CarViewer.jsx`

**What to do:**
1. Import `useGLTF` from `@react-three/drei`
2. Create a `CarModel` component that loads a GLB file from the car's `modelUrl`
3. Keep `PlaceholderCar` as a fallback when `modelUrl` is null
4. Apply the `viewerColor` to the car body material when paint/wrap is selected
5. Add a loading state using `<Suspense>` with a simple spinner or text

**Key implementation detail — material color swap:**
```jsx
import { useGLTF } from '@react-three/drei';

function CarModel({ url, color }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.includes('body')) {
        child.material = child.material.clone();
        child.material.color.set(color);
      }
    });
  }, [scene, color]);

  return <primitive object={scene} />;
}
```

**Naming convention for model meshes:** When preparing models in Blender, meshes should be named:
- `body` — main car body (paint changes apply here)
- `wheels_FL`, `wheels_FR`, `wheels_RL`, `wheels_RR` — individual wheels
- `hood` — hood mesh
- `spoiler` — spoiler mesh
- `frontBumper` — front bumper
- `rearBumper` — rear bumper
- `sideskirts_L`, `sideskirts_R` — side skirts
- `glass` — all windows (don't change color)
- `lights` — headlights/taillights
- `interior` — interior (don't change color)
- `exhaust` — exhaust tips

---

### Task 2: Add Part Swap Visibility in the 3D Viewer

**Goal:** When a user selects/removes a part, show/hide the corresponding mesh in the 3D model.

**File to edit:** `app/src/components/CarViewer.jsx`

**What to do:**
1. Read `selectedParts` from the store
2. For each mod slot, check if a part is selected
3. Toggle mesh visibility based on selection:
   - If user selects aftermarket spoiler → hide stock `spoiler` mesh, load aftermarket GLB
   - If user removes the part → show stock mesh again
4. For wheels: when aftermarket wheels are selected, hide all `wheels_*` meshes and load the wheel GLB at each wheel position

**Store fields to read:**
```js
const selectedParts = useStore((s) => s.selectedParts);
// Each part has: { id, category, modelUrl, ... }
// category matches the mesh name convention above
```

---

### Task 3: Add Thumbnail Images to Parts Catalog

**Goal:** Show preview images for each part in the selector.

**File to edit:** `app/src/components/PartSelector.jsx`, `app/src/data/parts.js`

**What to do:**
1. Add thumbnail URLs to each part in `parts.js` (use placeholder images initially)
2. In `PartSelector.jsx`, render an `<img>` tag for the thumbnail
3. For paint/wraps, the color swatch already exists — just enhance with a larger preview
4. Add CSS for the thumbnail (48x48, rounded corners, object-fit: cover)

---

### Task 4: Expand the Parts Catalog

**Goal:** Add more realistic parts for each vehicle.

**File to edit:** `app/src/data/parts.js`

**What to do:**
Add at least 3-5 parts per category per car. Research real aftermarket parts and prices. Key categories to expand:
- **Wheels:** Add more sizes (16", 17", 19", 20"), brands (BBS, Advan, Gram Lights, TSW)
- **Spoilers:** Low-profile lips, GT wings, roof spoilers
- **Front bumpers:** More brand-specific options per car
- **Rear bumpers:** Currently empty — add options
- **Exhaust:** Add axle-back, turbo-back options; more brands (MagnaFlow, Flowmaster, HKS)
- **Hoods:** More options per car (vented, carbon, cowl induction)

**Data format to follow (example):**
```js
{
  id: 'bbs-rs-18',              // unique kebab-case ID
  category: 'wheels',
  brand: 'BBS',
  name: 'RS 18x8.5 +43',
  description: 'Classic mesh design, forged 2-piece',
  price: 850,                    // USD per unit
  priceUnit: 'each',            // 'each', 'unit', or 'pair'
  quantity: 4,                   // how many needed (4 for wheels, 1 for most parts)
  specs: {
    diameter: 18,
    width: 8.5,
    offset: 43,
    boltPattern: '5x114.3',
    weight: 9.1,
  },
  compatibleCars: ['civic-2024', 'wrx-2024'],  // must match car IDs from cars.js
  laborCost: 0,                  // installation cost (0 for wheels, varies for others)
  modelUrl: null,                // GLB URL when available
  thumbnail: null,               // image URL when available
}
```

---

### Task 5: Add More Vehicles to the Database

**Goal:** Expand from 5 to 15-20 popular cars.

**File to edit:** `app/src/data/cars.js`

**Suggested additions (popular mod platforms):**
- BMW M3/M4 (G80/G82)
- Nissan 370Z / Z (RZ34)
- Mazda MX-5 Miata (ND)
- VW Golf GTI/R (Mk8)
- Dodge Charger/Challenger
- Chevrolet Camaro
- Toyota GR86 / Subaru BRZ
- Hyundai Elantra N
- Audi S3/RS3
- Mercedes-AMG C43

**Required fields for each car:**
```js
{
  id: 'gr86-2024',              // kebab-case, unique
  make: 'Toyota',
  model: 'GR86',
  year: 2024,
  trim: 'Premium',
  thumbnail: null,
  modelUrl: null,               // GLB URL when model is ready
  specs: {
    boltPattern: '5x100',       // MUST be accurate per vehicle
    centerBore: 56.1,           // mm
    stockWheelDiameter: 18,     // inches
    stockWheelWidth: 7.5,
    stockOffset: 48,            // mm (ET)
    stockTireSize: '215/40R18',
    maxWheelDiameter: 19,
    minWheelDiameter: 17,
    wheelWellClearance: 28,     // mm
    brakeClearance: 17,         // min diameter
  },
  modSlots: ['wheels', 'spoiler', 'frontBumper', 'rearBumper', 'sideskirts', 'hood', 'paint', 'exhaust'],
  basePrice: 32000,
}
```

**Important:** Research the correct bolt pattern, center bore, and stock wheel specs for each car. These must be accurate for fitment validation to work correctly. Different cars may have different bolt patterns (5x100, 5x112, 5x114.3, 5x120, etc.).

---

### Task 6: Enhanced Fitment Validation

**Goal:** Add tire size calculation and more validation rules.

**File to edit:** `app/src/utils/fitment.js`

**What to add:**
1. **Center bore check** — warn if wheel center bore doesn't match car (hub-centric vs hub rings)
2. **Tire size calculator** — given a wheel diameter/width, suggest compatible tire sizes
3. **Overall diameter check** — ensure wheel+tire combo stays within ~3% of stock overall diameter (speedometer accuracy)
4. **Suspension check** — if car is lowered, reduce clearance values
5. **Scrub radius warning** — extreme offset changes affect handling

---

### Task 7: Backend API Setup

**Goal:** Move data from static JS files to a proper backend.

**Suggested approach:**
1. Create `app/server/` directory
2. Use Express.js or Fastify
3. Set up SQLite (for dev) or PostgreSQL (for prod) with these tables:
   - `cars` — vehicle database
   - `parts` — aftermarket parts catalog
   - `fitment_rules` — per-car fitment constraints
   - `builds` — saved user builds
   - `build_parts` — junction table (build → parts)
4. Create REST endpoints:
   - `GET /api/cars` — list all cars
   - `GET /api/cars/:id` — get car with specs
   - `GET /api/parts?car=civic-2024&category=wheels` — filtered parts
   - `POST /api/builds` — save a build
   - `GET /api/builds/:id` — load a build
5. Update frontend to fetch from API instead of importing static data

---

### Task 8: User Authentication

**Goal:** Let users create accounts and persist builds.

**What to implement:**
1. Simple email/password auth (or OAuth with Google/GitHub)
2. JWT tokens for session management
3. User profile page with saved builds
4. Share builds via unique URL (already partially implemented with base64 encoding)

---

### Task 9: Deployment Setup

**Goal:** Get the app deployed and accessible.

**What to do:**
1. Add `vercel.json` or `netlify.toml` for frontend deployment
2. Set up environment variables for API URL
3. Configure production build optimization (code splitting for Three.js)
4. Add proper `<meta>` tags for SEO and social sharing (Open Graph)

---

## 3D MODEL SPECIFICATIONS

When preparing or sourcing 3D models, they must meet these requirements:

### Format
- **GLB** (binary glTF) — single file, optimized for web
- NOT .obj, .fbx, .blend — these need conversion first

### Polygon Budget
| Asset Type | Target Polycount | Max File Size |
|-----------|-----------------|---------------|
| Car body (full) | 30,000 - 80,000 tris | 2-5 MB |
| Wheel (single) | 5,000 - 15,000 tris | 200-500 KB |
| Spoiler | 2,000 - 8,000 tris | 100-300 KB |
| Bumper | 5,000 - 15,000 tris | 200-500 KB |
| Hood | 3,000 - 8,000 tris | 100-300 KB |

### Mesh Naming Convention
Models MUST have meshes named according to our convention for part swapping to work:
- `body`, `hood`, `spoiler`, `frontBumper`, `rearBumper`
- `sideskirts_L`, `sideskirts_R`
- `wheels_FL`, `wheels_FR`, `wheels_RL`, `wheels_RR`
- `glass`, `lights`, `interior`, `exhaust`

### Materials
- Use PBR materials (metalness/roughness workflow)
- Car body material should be a single material so color swaps work
- Bake textures to 1024x1024 or 2048x2048 max
- Use Draco compression when exporting GLB (reduces file size 50-80%)

---

## 3D MODEL SOURCING GUIDE

### Free Sources
1. **Sketchfab** (sketchfab.com) — Filter by "Downloadable", license "CC BY" or "CC0". Many free car models available. Download in glTF format directly.
2. **TurboSquid** (turbosquid.com) — Filter by "Free" and "glTF/GLB". Quality varies.
3. **CGTrader** (cgtrader.com) — Free section has some usable car models.
4. **Poly Haven** (polyhaven.com) — Free HDRIs for environment lighting (useful for the viewer).
5. **Google Poly / Poly Pizza** — Simple low-poly car models, good for testing.

### Paid Sources (Best Quality)
1. **CGTrader** — $20-$200 per car model, many pre-separated into parts
2. **TurboSquid** — Premium quality models, $50-$500+
3. **Sketchfab Store** — $10-$100, some come in glTF already
4. **Hum3D** (hum3d.com) — High-quality car models specifically, $40-$75

### Blender Workflow for Making Models Web-Ready

Since you have Blender and some basic models, here's the workflow:

**Step 1: Import & Clean**
1. Import the model (File > Import)
2. Delete hidden/unnecessary objects (interior detail if not visible, undercarriage)
3. Remove duplicate vertices (Edit Mode > Merge by Distance)

**Step 2: Separate into Parts**
1. Enter Edit Mode on the car mesh
2. Select the wheel faces → P > Selection (separates into new object)
3. Repeat for: hood, spoiler, each bumper, side skirts
4. Name each object per our naming convention

**Step 3: Reduce Polygons**
1. Add Decimate modifier to high-poly meshes
2. Use "Collapse" mode, target ratio 0.3-0.5
3. Check that silhouette still looks correct
4. Apply the modifier

**Step 4: Optimize Materials**
1. Ensure car body uses a single material
2. Bake complex materials to simple PBR textures if needed
3. Reduce texture sizes to 1024x1024

**Step 5: Set Origin Points**
1. For each separated part, set origin to the part's natural pivot point
2. Wheels: origin at center of wheel
3. Hood: origin at hinge point
4. This ensures parts swap into the correct position

**Step 6: Export as GLB**
1. File > Export > glTF 2.0 (.glb)
2. Enable "Draco compression" in export settings
3. Set texture quality to 85%
4. Export the full car as one GLB (with all named meshes)
5. Export individual aftermarket parts as separate GLBs

### Testing Models
Place exported GLB files in `app/public/models/` and update the `modelUrl` field:
```js
// In cars.js
modelUrl: '/models/civic-2024.glb',

// In parts.js
modelUrl: '/models/parts/enkei-rpf1.glb',
```

---

## CODING CONVENTIONS

- **State management:** All shared state goes through Zustand (`src/store/useStore.js`). Don't use local component state for data that other components need.
- **Styling:** Use CSS classes in `App.css`. Follow the existing CSS variable system (`--bg-primary`, `--accent`, etc.). No CSS-in-JS.
- **Data format:** Follow the exact schema in `cars.js` and `parts.js`. All IDs are kebab-case. All prices in USD.
- **Fitment:** All fitment validation goes through `utils/fitment.js`. Add new validation functions there, not in components.
- **No extra dependencies** without good reason. The stack is intentionally lightweight.

---

## PRIORITY ORDER

If time is limited, work on tasks in this order:
1. **Task 1** (GLB loading) — unlocks the whole visual experience
2. **Task 4** (more parts) — makes the app feel real
3. **Task 5** (more cars) — expands the audience
4. **Task 2** (part swap visibility) — the "wow" feature
5. **Task 6** (better fitment) — adds credibility
6. **Task 3** (thumbnails) — polish
7. **Tasks 7-9** (backend, auth, deploy) — production readiness
