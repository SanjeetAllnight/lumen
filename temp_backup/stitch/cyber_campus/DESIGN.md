# Design System Specification: The Kinetic Observatory

## 1. Overview & Creative North Star
This design system is a departure from the static, grid-bound interfaces of the past. Our Creative North Star is **"The Kinetic Observatory."** We are not just building a dashboard; we are creating a lens through which users observe the living, breathing data of a campus ecosystem.

To achieve a "premium and alive" feel, we move beyond flat containers. This system prioritizes **Atmospheric Depth** over structural rigidity. By utilizing intentional asymmetry, overlapping glass surfaces, and high-contrast typography, we create an editorial experience that feels like a high-end heads-up display (HUD) rather than a website. We break the "template" look by treating the screen as a 3D space where light and blur define boundaries.

---

## 2. Colors & Atmospheric Layering
The palette is rooted in the deep void of the campus night, punctuated by the vibrant signals of human activity.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` against the `background` to define regions.
2.  **Tonal Transitions:** Subtle shifts between `surface-dim` and `surface-bright`.
3.  **Luminous Separation:** Use the glow of an accent color to imply a boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested, translucent layers. 
- **Base Layer:** `surface` (#0a0e19) – The foundation.
- **Sectioning:** `surface-container-low` (#0f131f) – For broad content areas.
- **Interactive Elements:** `surface-container-high` (#1a1f2e) – For cards and focused data.
- **Active Overlays:** `surface-variant` (#202535) with 60% opacity and `backdrop-filter: blur(20px)` for the signature glass effect.

### The "Glass & Gradient" Rule
To elevate CTAs and Hero sections, use linear gradients transitioning from `primary` (#c799ff) to `primary-container` (#bc87fe) at a 135-degree angle. This "luminous pulse" provides a tactile, professional polish that flat fills cannot replicate.

---

## 3. Typography: The Editorial Voice
We pair the technical precision of **Space Grotesk** with the human-centric warmth of **Manrope**.

*   **Display & Headlines (Space Grotesk):** These are our "Data Anchors." Use `display-lg` (3.5rem) for hero metrics. The wide aperture of Space Grotesk feels futuristic and authoritative.
*   **Body & Labels (Manrope):** Use for all long-form content. The high x-height of Manrope ensures legibility against dark, blurred backgrounds.
*   **Hierarchy:** Maintain a dramatic scale. A `display-sm` headline should often sit adjacent to a `label-md` to create a sophisticated, high-contrast editorial rhythm.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are light, not dark.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card inside a `surface-container-high` area to create a "sunken" utility look, or stack `surface-bright` on `surface` for a "lifted" look.
*   **Ambient Shadows (The Glow):** Floating elements must use shadows tinted with the `primary` or `secondary` tokens at 8% opacity with a blur radius of at least 40px. This mimics the way neon light interacts with a dark environment.
*   **The "Ghost Border" Fallback:** If containment is required for accessibility, use a **Ghost Border**: `outline-variant` at 15% opacity. Never use 100% opaque lines.
*   **Glassmorphism:** All floating modals or navigation rails must use `surface-variant` with a backdrop blur. This ensures the "Pulse" of the background (the colors and shapes behind) bleeds through, keeping the UI "alive."

---

## 5. Components

### Buttons: Kinetic Triggers
*   **Primary:** Gradient fill (`primary` to `primary-container`). Roundedness: `full`. Soft `primary` glow on hover.
*   **Secondary:** Ghost Border (`secondary` at 20% opacity) with `secondary` text.
*   **Tertiary:** No background. Text only in `tertiary` (#9f8eff), uppercase, with increased letter spacing for a technical feel.

### Cards: Content Vessels
Cards must not have borders. Use `surface-container-high` and a corner radius of `xl` (1.5rem). 
*   **Editorial Note:** Use the Spacing Scale `8` (2.75rem) for internal padding to give data room to breathe.

### Status Indicators: Luminous Signals
Status is communicated via "Glow States" rather than flat icons:
*   **Issues:** `error` (#ff6e84) with a 12px outer glow.
*   **Events:** `tertiary_fixed` (#b2a5ff) (Electric Blue/Purple mix).
*   **Resolved:** `secondary` (#4af8e3) (Electric Blue).

### Input Fields
Use `surface-container-lowest` (#000000) for the input track to create a "recessed" feel. The cursor and active bottom-border should pulse with the `secondary` electric blue.

### Pulse-Specific Components
*   **The Live-Feed List:** Do not use dividers. Separate items using `3` (1rem) on the Spacing Scale and alternate background tones between `surface-container-low` and `surface-container-high`.
*   **Glass Data-Tiles:** Small, translucent squares (`surface-variant` @ 40%) used to highlight micro-stats within a larger view.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Intentional Asymmetry:** Align a headline to the left but offset the supporting data to the right to create visual tension.
*   **Embrace the Void:** Use the `20` and `24` spacing tokens to create vast areas of "dark space."
*   **Layer Light:** Allow the `primary` and `secondary` accents to overlap in blurs behind glass components.

### Don’t:
*   **Don't use 1px solid borders:** It shatters the "Kinetic Observatory" illusion.
*   **Don't use pure white (#FFFFFF):** Always use `on-surface` (#e8eafb) to prevent eye strain and maintain the dark-mode aesthetic.
*   **Don't crowd the UI:** If a layout feels "busy," increase the spacing scale by two levels. This system lives or dies by its "premium" breathing room.