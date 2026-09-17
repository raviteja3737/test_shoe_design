# AI Shoe Design Studio — MVP / PRD / RPR Plan

**Project owner / assignment:** Hemanth (Ande Hemanth)  
**Primary evaluation surface:** Browser experience  
**MVP priority:** Visual quality + AI intelligence + polished UX  
**Generation philosophy:** Lightweight, browser-first, no Blender/local heavy 3D workloads

---

## 1. Product Vision

Build a browser-based AI Shoe Design Studio where a user can combine real-world footwear inspirations, art/design styles, and a natural-language prompt to generate **three plausible shoe concepts**.

The user then switches between the three concepts, selects one, and opens an interactive 3D presentation/editor where the shoe can be rotated, zoomed, and refined using natural language.

The core promise is:

> **AI turns a user's ideas and references into realistic, wearable shoe concepts that can be explored and refined in 3D directly in the browser.**

The product is a design/prototyping experience, not a manufacturing/CAD system.

---

## 2. What Hemanth Should Experience

The demo should communicate two things immediately:

1. **AI can design realistic, wearable shoes.**
2. **AI can combine multiple inspirations into a coherent new shoe concept.**

The strongest demo sequence is:

```text
Landing page (optional)
        ↓
Shoe Design Studio
        ↓
Choose inspirations / art style
        ↓
Write design prompt
        ↓
Generate 3 concepts
        ↓
Concept 1 / Concept 2 / Concept 3 tabs
        ↓
Select a concept
        ↓
Interactive 3D shoe
        ↓
Natural-language refinement
        ↓
Updated shoe
```

---

## 3. MVP Scope

### MUST HAVE

- Polished landing page or direct entry into the studio
- Strong Shoe Design Studio UI
- Text prompt
- Inspiration selection
- Multiple inspiration combinations
- Art/design style selection
- Real-world footwear/brand-reference influence
- Realistic/wearable design constraint
- AI generation of 3 concepts
- Clearly different concept variations
- Concept 1 / 2 / 3 navigation
- Interactive browser 3D view
- Rotate/orbit
- Scroll/pinch zoom
- Natural-language editing/refinement
- AI interpretation of vague prompts
- Realistic design guardrail
- Premium presentation
- Architecture prepared for image upload later

### NOT REQUIRED IN MVP

- Reference-image upload
- Full accounts/authentication
- Payments
- Manufacturing-ready CAD
- Exact physical shoe dimensions
- GLB/OBJ download
- Complex animation rigs
- Blender dependency
- Local GPU model hosting
- Heavy local 3D generation
- Full collaborative design workspace

---

## 4. User Experience Principles

### 4.1 Beginner friendly

A user should be able to write:

> "I want a premium everyday sneaker for college that feels sporty but minimal."

without knowing footwear terminology.

The system should infer reasonable design decisions automatically.

### 4.2 Wearability over fantasy

The AI should strongly prefer commercially plausible footwear proportions, construction patterns, materials, and silhouettes.

For example, a prompt such as:

> "Make a futuristic spaceship-inspired shoe"

should be interpreted as:

> streamlined, aerodynamic, performance-inspired footwear

rather than literally attaching spaceship parts to the shoe.

### 4.3 Inspiration is guidance, not cloning

Users may reference brands such as Nike, Adidas, On, and other established footwear companies as inspiration.

The application should translate these references into **design characteristics and footwear conventions**, rather than reproducing logos, exact products, or distinctive trade dress.

The UI should frame brand references as inspiration/reference points.

### 4.4 Visual quality is critical

The shoe does not need microscopic manufacturing detail. It needs to look convincing at normal browser viewing distances and remain smooth during ordinary rotation/zoom.

---

# 5. Main Screens

## Screen 1 — Landing Page

Optional but recommended for polish.

### Hero

Large premium 3D sneaker slowly rotating.

Headline concept:

> **Design the shoe you imagine.**

Supporting message:

> Combine inspirations, styles, and your own ideas. Let AI turn them into wearable 3D concepts.

Primary CTA:

> **Start Designing**

Secondary CTA:

> Explore Concepts

The landing page should lead to the studio quickly; do not bury the actual product behind marketing sections.

---

# 6. Main Shoe Design Studio

Recommended layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo                         My Designs              Generate │
├───────────────┬───────────────────────────┬──────────────────┤
│ Inspirations  │                           │ Design Brief     │
│               │                           │                  │
│ [Running]     │       3D / Preview        │ Prompt           │
│ [Minimal]     │                           │                  │
│ [Luxury]      │          SHOE             │ [..............] │
│ [Retro]       │                           │                  │
│               │                           │ Art Style        │
│ Brand refs    │                           │ [Minimal]        │
│ Nike          │                           │ [Futuristic]     │
│ Adidas        │                           │ [Luxury]         │
│ On            │                           │                  │
│ ...           │                           │ [Generate]       │
└───────────────┴───────────────────────────┴──────────────────┘
```

The exact layout can change during implementation, but the design should preserve:

- inspiration area
- central visual area
- prompt/design area
- obvious generation action

---

# 7. Inspiration System

Users should be able to combine several inspirations.

Example:

```text
Running + Minimal + Luxury
```

or:

```text
Retro + Streetwear + Performance
```

### Inspiration groups

Suggested MVP categories:

- Performance
- Running
- Lifestyle
- Streetwear
- Minimal
- Retro
- Luxury
- Futuristic
- Basketball
- Outdoor

### Brand reference group

Examples can include:

- Nike
- Adidas
- On
- New Balance
- ASICS
- Puma
- Salomon
- Hoka
- Converse
- Vans

These are reference directions, not cloning targets.

For the initial MVP, the brand/reference system can be represented internally as structured style profiles instead of relying on live web scraping.

---

# 8. Art / Design Style

Art style should influence both:

1. The shoe's design language.
2. The presentation/render environment.

Examples:

- Minimal
- Futuristic
- Retro
- Luxury
- Sport-tech
- Streetwear
- Editorial
- Performance

The user should be able to combine inspirations with an art/design style.

Example:

```text
Inspiration:
Running + On-inspired performance language

Style:
Minimal + Luxury

Prompt:
"Premium everyday running-inspired sneaker for urban college wear"
```

---

# 9. Prompt System

The prompt is natural language.

Examples:

> "Create a clean white everyday sneaker with a slightly chunky sole, breathable upper, and subtle metallic accents."

> "Create a premium running-inspired shoe that looks comfortable enough for daily use but still works with smart casual clothing."

The AI should fill missing details intelligently.

For vague prompts, the AI should make sensible assumptions rather than constantly interrupting the user with questions.

---

# 10. Three-Concept Generation

The first generation should produce three distinct concepts.

### Concept strategy

Concept 1 = safer / commercially conservative

Concept 2 = balanced / creative

Concept 3 = more experimental but still wearable

This provides meaningful variation without allowing all three to become unrealistic.

Example:

```text
Concept 01
Clean Performance

Concept 02
Urban Premium

Concept 03
Modern Experimental
```

The user sees:

```text
Concept 1 | Concept 2 | Concept 3
```

and can switch between them.

The three concepts should not be mere recolors.

They should vary in:

- silhouette
- sole profile
- panel language
- proportion
- material combination
- color direction
- styling

---

# 11. AI Design Representation

The key architectural decision for MVP is **not to run a heavy 3D generator locally**.

The AI should first convert the user's request into a structured shoe design specification.

Example:

```json
{
  "category": "lifestyle_running",
  "silhouette": "streamlined",
  "sole_profile": "moderately_thick",
  "upper": "engineered_mesh",
  "secondary_material": "synthetic_leather",
  "primary_color": "white",
  "secondary_color": "silver",
  "accent_color": "black",
  "style": ["minimal", "premium", "performance"],
  "wearability": "high",
  "geometry_variation": {
    "toe_shape": 0.42,
    "heel_height": 0.48,
    "sole_thickness": 0.62,
    "collar_height": 0.38,
    "panel_complexity": 0.35
  }
}
```

The browser then uses the structured specification to construct/display the shoe.

---

# 12. Recommended 3D Architecture

## MVP recommendation

Use a **browser-native 3D system** based on:

- Next.js / React
- Three.js
- React Three Fiber
- GLB/glTF assets
- Browser-side materials/lights/camera

Three.js's WebGL renderer renders scenes directly in the browser, and its GLTFLoader supports glTF 2.0 assets. OrbitControls provides orbiting, zooming, and panning interactions. citeturn809874search0turn809874search5turn809874search1

### Why this architecture

- no Blender runtime
- no local GPU generation
- no large 3D model hosted on the user's machine
- fast visual interaction once assets are loaded
- easy browser deployment
- natural fit for the required rotate/zoom experience
- allows gradual improvement later

---

# 13. How the Browser Should Create Variation

The MVP should use a small curated set of high-quality footwear base assets and/or modular shoe components.

Instead of:

```text
Prompt → huge 3D model → browser
```

use:

```text
Prompt
   ↓
LLM
   ↓
Structured design JSON
   ↓
Browser 3D engine
   ↓
Base silhouette + geometry parameters + materials
   ↓
Concept
```

Geometry variation can be controlled through a constrained parameter system such as:

- toe length
- toe roundness
- shoe width
- sole thickness
- heel height
- heel flare
- collar height
- panel positions
- panel count
- sole segmentation
- lace configuration

This is intentionally constrained to footwear-like ranges.

---

# 14. Hybrid Upgrade Path

The MVP architecture should keep the possibility of adding a true external 3D-generation API later.

A current example is Meshy's API, which provides Text-to-3D and Image-to-3D workflows and can return GLB output. Its current Text-to-3D flow separates preview mesh generation from refinement/texturing. citeturn770680search0turn770680search1

That should be treated as a **Phase 2/advanced generation layer**, not a dependency for every MVP generation.

Possible future pipeline:

```text
User request
     ↓
LLM design understanding
     ↓
3D generation API
     ↓
GLB
     ↓
optimization / validation
     ↓
Three.js viewer
```

This preserves a path toward genuinely generated unique geometry without making the browser or local machine responsible for heavy model execution.

---

# 15. 3D Viewer Requirements

The MVP only needs minimal effects and interaction.

### Required

- rotate/orbit
- mouse-wheel zoom
- touch zoom where practical
- smooth camera damping
- responsive canvas
- attractive studio lighting
- subtle ground shadow
- clean background
- optional slow auto-rotation when idle

### Avoid

- excessive post-processing
- huge textures
- complex particle effects
- heavy physics
- unnecessary environmental scenes
- high-poly geometry that hurts normal laptops

---

# 16. Concept Selection UX

When generation is complete:

```text
                 YOUR CONCEPTS

       Concept 1       Concept 2       Concept 3
       [preview]       [preview]       [preview]
          ●               ○               ○

             [ Open in 3D Studio ]
```

The user can switch between tabs rather than loading three large scenes simultaneously where possible.

This keeps browser memory and GPU usage controlled.

---

# 17. Iterative Editing

After selecting a concept, the user gets a compact prompt bar:

> "Make the sole slightly thicker and replace the silver accents with deep blue."

The LLM converts that request into a modification object.

Example:

```json
{
  "changes": {
    "sole_thickness": "+10%",
    "accent_color": "#183B70"
  }
}
```

The browser then applies the changes to the active 3D scene.

The goal is fast perceived iteration rather than regenerating a complete heavy 3D asset for every minor edit.

---

# 18. Realism / Wearability Guardrail

This is a core feature, not an optional prompt instruction.

The AI system prompt should contain a strong footwear-design policy such as:

```text
Design footwear that could plausibly be manufactured and worn.
Prioritize recognizable human footwear proportions.
Use realistic sole, upper, heel, toe, collar, and panel structures.
Treat futuristic or artistic language as styling guidance rather than literal fantasy objects.
Do not introduce wings, wheels, weapons, animal limbs, floating parts,
or other non-footwear structures unless the user explicitly requests
an experimental concept; even then preserve a wearable shoe foundation.
Use established commercial footwear design conventions as references.
```

The LLM should produce a practical interpretation when the user's input is vague or unrealistic.

---

# 19. Reference / Brand Knowledge

Instead of copying specific products, maintain structured brand/style descriptors.

Example internal representation:

```json
{
  "brand_reference": "performance_running",
  "design_traits": [
    "streamlined silhouette",
    "performance-oriented sole",
    "technical upper",
    "restrained branding",
    "athletic proportions"
  ]
}
```

This lets the application benefit from real-world footwear references while keeping generated designs original.

---

# 20. Image Upload — Future-Ready Architecture

Image upload is explicitly **not part of MVP**, but the data flow should be designed so it can be added later.

Future flow:

```text
Text prompt
     +
Inspiration selections
     +
Art style
     +
Reference image
     ↓
AI interpretation
     ↓
Unified design specification
     ↓
3D generation
```

The frontend should represent user inspiration as a generic `referenceInputs[]` structure so a future image input can be added without replacing the existing prompt system.

---

# 21. Suggested Frontend Stack

```text
Next.js
React
TypeScript
Tailwind CSS
React Three Fiber
Three.js
GLB / glTF
```

Optional utility libraries can be introduced only when they solve a concrete UX problem.

---

# 22. Suggested Backend

A small backend/API layer is recommended to protect AI API keys and normalize AI responses.

```text
Browser
   ↓
Next.js API / server route
   ↓
LLM provider
   ↓
validated JSON
   ↓
Browser
```

The browser should never contain a secret provider API key.

For MVP, persistence can be minimal or absent.

---

# 23. Core Data Objects

## DesignRequest

```ts
interface DesignRequest {
  prompt: string;
  inspirations: string[];
  artStyle: string[];
  brandReferences?: string[];
  referenceImages?: string[];
}
```

## ShoeConcept

```ts
interface ShoeConcept {
  id: string;
  name: string;
  designSpec: ShoeDesignSpec;
  modelAsset: string;
  summary: string;
}
```

## ShoeDesignSpec

```ts
interface ShoeDesignSpec {
  category: string;
  silhouette: string;
  upper: string;
  sole: string;
  materials: string[];
  colors: string[];
  proportions: Record<string, number>;
  details: string[];
  wearability: 'high' | 'medium' | 'experimental';
}
```

---

# 24. API Shape

### POST `/api/design/generate`

Input:

```json
{
  "prompt": "premium everyday running sneaker",
  "inspirations": ["running", "minimal", "luxury"],
  "artStyle": ["minimal", "editorial"],
  "brandReferences": ["Nike", "On"]
}
```

Output:

```json
{
  "concepts": [
    {
      "id": "c1",
      "name": "Clean Performance",
      "designSpec": {},
      "asset": "running-base-01.glb"
    },
    {
      "id": "c2",
      "name": "Urban Motion",
      "designSpec": {},
      "asset": "running-base-02.glb"
    },
    {
      "id": "c3",
      "name": "Modern Edge",
      "designSpec": {},
      "asset": "running-base-03.glb"
    }
  ]
}
```

### POST `/api/design/refine`

Input:

```json
{
  "conceptId": "c2",
  "instruction": "Make the sole slightly thicker and use dark blue accents"
}
```

Output:

```json
{
  "changes": {
    "soleThickness": 0.68,
    "accentColor": "#142B5F"
  }
}
```

---

# 25. Performance Targets

The MVP should prioritize normal-device usability.

### Target

- fast initial page load
- interactive 3D after assets load
- smooth normal rotation
- smooth ordinary zoom
- avoid loading all heavy concept assets simultaneously
- compressed GLB assets
- modest texture resolution
- responsive layout

The MVP is intentionally not targeting extreme close-up inspection.

---

# 26. Visual Direction

Chosen direction: **Premium fashion studio**.

Characteristics:

- clean white/neutral base
- large typography
- generous whitespace
- premium product photography feel
- restrained motion
- soft shadows
- elegant cards
- minimal chrome around the 3D shoe

The interface should feel closer to a footwear/fashion design product than a generic AI dashboard.

---

# 27. Generation Loading Experience

Avoid a generic spinner.

Use a short staged state:

```text
Analyzing your inspiration
        ↓
Exploring silhouettes
        ↓
Balancing wearability
        ↓
Applying materials and style
        ↓
Preparing 3D concepts
```

This creates the perception of an intelligent design process without exposing unnecessary technical implementation.

---

# 28. MVP Demo Script

For Hemanth's evaluation, the recommended demonstration is:

### Step 1
Open the studio.

### Step 2
Select:

```text
Running
Minimal
Luxury
```

and one or two brand-reference directions.

### Step 3
Enter:

> "Create a premium everyday running shoe that feels modern enough for college and can also work with smart casual clothing."

### Step 4
Generate three concepts.

### Step 5
Switch between Concept 1 / 2 / 3 and demonstrate visible variation.

### Step 6
Open the chosen concept in the interactive 3D view.

### Step 7
Enter:

> "Make the sole slightly thicker and change the accents to deep blue."

### Step 8
Show the modified result.

The entire demo should communicate the concept without needing to explain the backend.

---

# 29. Development Phases

## Phase 0 — Design system

- project structure
- typography
- color system
- responsive layout
- premium visual language

## Phase 1 — 3D foundation

- Three.js / React Three Fiber
- GLB loading
- camera
- orbit controls
- lighting
- shadow
- responsive canvas

## Phase 2 — Shoe asset system

- establish curated shoe base assets
- split/modularize where practical
- define safe geometry parameters
- create material presets

## Phase 3 — AI design engine

- prompt normalization
- inspiration interpretation
- art-style interpretation
- brand-reference interpretation
- realism guardrail
- structured JSON output

## Phase 4 — Three concepts

- three variation strategies
- concept cards/tabs
- distinct geometry/material combinations

## Phase 5 — Refinement

- natural-language edit prompt
- structured change output
- instant browser-side updates

## Phase 6 — Polish

- animation
- loading states
- responsive behavior
- error states
- performance optimization

## Phase 7 — Future image input

Not required for MVP; add after the core flow is stable.

---

# 30. Acceptance Criteria

The MVP is considered successful when all of the following are true:

### Product

- A new user understands what the product does within seconds.
- The main studio is immediately accessible.
- The user can combine multiple inspirations.
- The user can provide natural-language instructions.
- The AI produces three meaningfully different concepts.
- Designs remain recognizably wearable footwear.

### 3D

- The selected concept is presented as interactive 3D in the browser.
- The user can rotate and zoom smoothly.
- The model looks convincing at normal viewing scale.

### AI editing

- The user can describe a modification naturally.
- The system changes the active design without resetting the entire session.

### UX

- The website feels like a premium product rather than a raw demo.
- Loading states clearly communicate progress.
- Failures are handled gracefully.

### Architecture

- No Blender dependency.
- No local heavyweight model execution.
- API keys remain server-side.
- The frontend is prepared for future image-reference input.

---

# 31. Explicit Non-Goals

Do not spend MVP time on:

- manufacturing/CAD accuracy
- sneaker engineering certification
- foot biomechanics simulation
- exact sizing/fit prediction
- physical prototyping
- e-commerce
- payment systems
- user accounts unless later required
- downloadable production models
- complex 3D animation
- massive model-generation infrastructure

The goal is a **high-quality browser demonstration of AI-assisted shoe concept design**.

---

# 32. Future Roadmap

### V2

- reference-image upload
- image-to-design interpretation
- additional shoe categories
- more base silhouettes
- richer geometry controls
- design history
- undo/redo
- compare versions

### V3

- true external text/image-to-3D generation
- generated unique meshes
- automatic mesh optimization
- richer material generation
- saved projects
- shareable design links

### V4

- production-oriented design constraints
- manufacturing-oriented geometry
- size/fit parameters
- AR try-on / visualization
- supplier/manufacturing export workflows

---

# 33. Final MVP Architecture

```text
                         USER
                           │
                           ▼
                 ┌────────────────────┐
                 │   NEXT.JS WEBSITE  │
                 │                    │
                 │ Landing            │
                 │ Design Studio       │
                 │ Inspirations        │
                 │ Prompt              │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │  DESIGN API LAYER  │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │       LLM          │
                 │                    │
                 │ Prompt + style +   │
                 │ references         │
                 │        ↓           │
                 │ Structured JSON    │
                 └─────────┬──────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ BROWSER 3D DESIGN ENGINE │
              │                          │
              │ React Three Fiber        │
              │ Three.js                 │
              │ GLB assets               │
              │ Materials                │
              │ Geometry parameters      │
              └────────────┬─────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ 3D SHOE VIEW  │
                   │               │
                   │ Rotate        │
                   │ Zoom          │
                   │ Refine        │
                   └───────────────┘

       FUTURE OPTIONAL LAYER

          LLM → 3D Generation API → GLB → Viewer
```

---

# 34. Core Product Decision

**The MVP should optimize for what Hemanth can see and interact with in the browser.**

Therefore:

> **Do not make local 3D generation or Blender a requirement.**

The first version should create the perception of a sophisticated AI shoe-design system using a strong design-understanding layer, constrained footwear generation, curated 3D assets, and browser-native rendering.

The architecture deliberately leaves a clean upgrade path to genuine AI-generated 3D meshes later.

---

## Document Status

**Status:** MVP direction locked  
**Next step:** Convert this specification into the project repository structure, UI wireframe, component map, AI schema, and implementation prompts.
