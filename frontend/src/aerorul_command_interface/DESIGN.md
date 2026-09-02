---
name: AeroRUL Command Interface
colors:
  surface: '#101416'
  surface-dim: '#101416'
  surface-bright: '#363a3c'
  surface-container-lowest: '#0b0f11'
  surface-container-low: '#181c1e'
  surface-container: '#1c2023'
  surface-container-high: '#262b2d'
  surface-container-highest: '#313538'
  on-surface: '#e0e3e6'
  on-surface-variant: '#c2c6d4'
  inverse-surface: '#e0e3e6'
  inverse-on-surface: '#2d3133'
  outline: '#8c909e'
  outline-variant: '#424752'
  surface-tint: '#acc7ff'
  primary: '#acc7ff'
  on-primary: '#002f67'
  primary-container: '#0056b3'
  on-primary-container: '#bbd0ff'
  inverse-primary: '#115cb9'
  secondary: '#c2c7d0'
  on-secondary: '#2c3138'
  secondary-container: '#42474f'
  on-secondary-container: '#b1b5bf'
  tertiary: '#c4c6cf'
  on-tertiary: '#2e3037'
  tertiary-container: '#565960'
  on-tertiary-container: '#ced0d9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#acc7ff'
  on-primary-fixed: '#001a40'
  on-primary-fixed-variant: '#004491'
  secondary-fixed: '#dee2ec'
  secondary-fixed-dim: '#c2c7d0'
  on-secondary-fixed: '#171c23'
  on-secondary-fixed-variant: '#42474f'
  tertiary-fixed: '#e1e2eb'
  tertiary-fixed-dim: '#c4c6cf'
  on-tertiary-fixed: '#191c22'
  on-tertiary-fixed-variant: '#44474e'
  background: '#101416'
  on-background: '#e0e3e6'
  surface-variant: '#313538'
typography:
  display-metric:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  sidebar_width: 240px
  header_height: 64px
---

## Brand & Style
The design system is engineered for mission-critical aerospace applications, where data density and cognitive clarity are paramount. The aesthetic merges the authoritative utility of NASA mission control centers with the sleek, high-fidelity precision of modern analytical software.

The visual style is **Corporate Modern with a Technical Edge**. It prioritizes a highly structured information hierarchy, utilizing a rigid grid system and subtle borders to compartmentalize complex telemetry. The emotional response is one of absolute reliability, precision, and calm under pressure. Surface treatments are flat or use minimal tonal layering to ensure that functional data—not the UI chrome—remains the primary focus.

## Colors
The palette is rooted in high-contrast utility. The default mode is **Dark**, optimized for long-duration monitoring in low-light environments, reducing eye strain while making status indicators pop.

- **Primary (Aerospace Blue):** Used for interactive elements, primary actions, and active states.
- **Surface Strategy:** In Dark Mode, `#0B0E14` serves as the canvas, while `#1A1F26` defines logical data containers. In Light Mode, `#F8F9FA` serves as the canvas with pure white (`#FFFFFF`) for elevated panels.
- **Status Colors:** These follow standard aviation protocols—Green for nominal operations, Amber for cautionary thresholds, and Red for critical failures or immediate intervention requirements.
- **Typography:** Dark graphite (`#212529`) is used for Light Mode readability; Light Silver (`#E9ECEF`) provides crisp contrast in Dark Mode.

## Typography
The typography system uses a tri-font approach to differentiate between intent:

1.  **Hanken Grotesk (Headings/Metrics):** Selected for its sharp, contemporary geometry. Use it for "Hero" metrics—the big, bold numbers that represent Remaining Useful Life (RUL) or critical pressure readings.
2.  **Inter (Body/UI):** The workhorse for all interface labels, paragraphs, and standard inputs. Its high x-height ensures legibility at small sizes.
3.  **JetBrains Mono (Technical/Labels):** Used for micro-copy, timestamps, coordinate data, and status labels. The monospaced nature ensures that numeric values do not jump visually when updating in real-time.

All headings should be kept compact with tight line heights to maintain the high-density information requirements.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. 
- **Sidebar:** A fixed-width navigation rail (240px) remains docked to the left for persistent access to fleet-wide analytics.
- **Header:** A fixed-height top bar (64px) houses global status indicators (System Health, Connectivity, Alerts).
- **Main Content:** A 12-column fluid grid system. Data-heavy dashboards should utilize a "Dashboard Slot" model, where cards occupy 3, 4, 6, or 12 columns depending on the complexity of the visualization.

Spacing is based on a **4px baseline grid**. Smaller increments (4px, 8px) are used within components to maintain density, while larger increments (16px, 24px) are used to separate major logical sections.

## Elevation & Depth
This design system avoids heavy shadows, favoring **Tonal Layers and Technical Outlines**.

- **Level 0 (Canvas):** Base background color.
- **Level 1 (Panels):** Slightly lighter (Dark Mode) or pure white (Light Mode) containers with a 1px subtle border (`rgba(255,255,255,0.1)` in dark mode).
- **Level 2 (Popovers/Modals):** Elements that sit above the UI use a subtle, crisp 8px blur shadow with zero spread to indicate lift without feeling "soft."

Depth is primarily communicated through color contrast and border definition. Active elements may use an inner-glow or a "Primary Blue" 2px left-border accent to signify focus.

## Shapes
In line with the technical engineering aesthetic, the shape language is **Soft but Geometric**. 

A base border-radius of `4px` (0.25rem) is applied to all buttons, input fields, and small components. This provides a modern touch while maintaining a professional, rigid structure. Large containers and cards may use up to `8px` for subtle distinction. Interactive "Pill" shapes are reserved strictly for status tags (e.g., "ONLINE", "ACTIVE") to differentiate them from square-edged functional buttons.

## Components
- **Buttons:** Sharp corners with a 4px radius. Primary buttons use the Aerospace Blue background. Ghost buttons use a 1px border and are preferred for secondary actions to reduce visual noise.
- **Data Cards:** Must include a header area with `label-caps` typography and a subtle 1px bottom divider. The body of the card should be padded at `16px`.
- **Status Indicators:** Small circular dots (8px) paired with `label-caps` text. Pulse animations may be used for "Live" data streams.
- **Input Fields:** Inset appearance in Light Mode; subtle stroke in Dark Mode. Use `JetBrains Mono` for numeric inputs to ensure alignment.
- **Charts:** Use thin stroke weights (1px to 1.5px) for line charts. Avoid area fills unless they are low-opacity (10%) to prevent obscuring grid lines.
- **Prediction Controls:** Sliders and toggles used for "What-if" analysis should be clearly distinguished with a secondary accent color (Cool Gray) to show they are simulations, not live telemetry.