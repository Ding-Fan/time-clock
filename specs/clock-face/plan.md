# ClockFace Implementation Plan

## Architecture Decisions

| Decision                   | Choice                                | Rationale                                                                    |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| **Component Type**         | Presentation (no state)               | Receives all data via props, parent controls state                           |
| **Styling Method**         | CSS custom properties                 | Dynamic rotation without JS DOM manipulation                                 |
| **Progress Visualization** | Gray conic gradient overlay           | Starts at 12 o'clock, fills clockwise, metaphor: "filling in completed time" |
| **Hand Design**            | Thick rounded rectangles with shadows | Realistic analog clock appearance, better visibility, depth effect           |
| **Hand Transitions**       | Shake animation (cubic-bezier)        | Realistic ticking motion for hour/minute, discrete for second hand           |
| **Brightness Control**     | Opacity on container                  | Simple, performant, affects entire clock including shadows                   |
| **Border Style**           | Multi-layer box shadows               | 3D depth effect without CSS 3D transforms                                    |
| **Center Cap Design**      | Two-layer (big gray + small red)      | Professional analog clock appearance, visual hierarchy                       |
| **Size Strategy**          | Fixed rem with max-width 100%         | Responsive, maintains aspect ratio                                           |

## Codebase Integration Strategy

**Component Location**: `src/lib/components/ClockFace.svelte`

- Located in `$lib/components/` for reusability
- Imported by page components via `$lib` alias

**Type Integration**:

- Uses `ClockHandAngles` from `src/lib/time/clockAngles.ts`
- Uses `Brightness` from `src/lib/stores/dayState.ts`
- No local type definitions (imports from source modules)

**CSS Custom Properties**:

- Component-level: `--hand-rotation`, `--elapsed-angle` (inline styles)
- Theme-level: `--clock-*` variables in `src/app.css` (global)
- Pattern: Local CSS vars for dynamic values, global for theme colors
- New variable: `--clock-progress-fill` (gray overlay) replaces `--clock-card-bg`

**Grid Integration**:

- Used in `src/routes/+page.svelte` within `grid grid-cols-4`
- Each clock is direct child of grid container
- Component size adapts to grid cell dimensions

## Technical Approach

**Existing Patterns to Follow**:

1. **Svelte 4 Syntax**: Uses `export let` for props (current project standard)
2. **TypeScript Imports**: Import types explicitly from `../time/clockAngles` and `../stores/dayState`
3. **Scoped Styles**: Component-specific CSS in `<style>` block (not Tailwind for complex animations)
4. **CSS Custom Properties**: Dynamic values via inline `style` attribute, theme via `app.css`

**Component Composition** (layering order):

```
ClockFace (container with multi-layer shadows)
  ├─ ::before (progress overlay, conic gradient)
  ├─ .clock-face__dial (hands container)
  │   ├─ hour shadow (blurred, offset)
  │   ├─ minute shadow (blurred, offset)
  │   ├─ second shadow (blurred, offset, conditional)
  │   ├─ hour hand (rounded rectangle with shake)
  │   ├─ minute hand (rounded rectangle with shake)
  │   ├─ big center cap (30px dark gray with shadow)
  │   ├─ second hand (thin red, on top, conditional)
  │   └─ small center cap (10px red with shadow, z-index: 10)
```

**Shadow System**:

- Each hand has matching shadow element rendered first
- Shadows use same transform but with offset
- Blur filter creates depth effect
- Shadow hands don't have shake animation (static shadows)

**CSS Custom Property Flow**:

```
Parent (dayState) calculates hand angles
  ↓
ClockFace receives handAngles prop
  ↓
Inline style sets --hand-rotation per hand
  ↓
CSS transform uses var(--hand-rotation)
  ↓
Browser animates rotation
```

**Progress Overlay Flow**:

```
Parent calculates progress (0-1)
  ↓
ClockFace clamps to 0-1
  ↓
Inline style sets --elapsed-angle (0-360deg)
  ↓
::before conic gradient fills gray from 12 o'clock (from -90deg)
  ↓
Gray fills clockwise to --elapsed-angle
  ↓
Opacity calculated from angle/360
  ↓
Visual result: White face → Gradually graying → Fully gray (when progress=1)
```

## Risk Assessment

| Risk                                    | Mitigation                                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Progress clamping edge cases**        | Reactive statement ensures 0-1 range via Math.max/min                                          |
| **CSS custom property browser support** | Supported in all modern browsers (Chrome 49+, Firefox 31+, Safari 9.1+)                        |
| **Animation performance with shadows**  | Use `will-change: transform`, shadows are static (no transitions), blur filter GPU-accelerated |
| **Aspect ratio on small screens**       | max-width: 100% prevents overflow, aspect-ratio maintains square                               |
| **Shadow hand duplication complexity**  | Clean conditional rendering pattern in Svelte, maintainable with clear comments                |
| **Multi-layer box shadow performance**  | Static shadows (no animation), acceptable performance cost for visual quality                  |

## Integration Points

**Type Dependencies**:

- `src/lib/time/clockAngles.ts` - `ClockHandAngles` type
- `src/lib/stores/dayState.ts` - `Brightness` type

**Parent Component**: `src/routes/+page.svelte`

- Subscribes to `dayState` store
- Maps `HourClock` objects to ClockFace props
- Renders 24 instances in grid

**Theme System**: `src/app.css`

- Defines `--clock-*` CSS variables in `:root`
- Component references via `var(--clock-hour-hand)` etc.

## Success Criteria

**Technical**:

- Zero prop drilling (all data via props)
- No runtime errors with edge case inputs
- Smooth animations at 60fps
- CSS custom properties correctly applied

**User**:

- Visually accurate clock representation
- Clear distinction between past/current/future states
- Smooth hand movements (except second hand)
- Readable at all supported viewport sizes

**Business**:

- Reusable across different time visualization features
- Maintainable CSS architecture
- Performance budget: <5ms render time per clock

## Robust Product (+4-6h)

Svelte 5 migration with `$props()` rune, configurable sizes (sm: 5rem, md: 7.5rem, lg: 10rem), theme variants (light/dark presets), accessibility improvements (ARIA labels for time, reduced-motion media query), keyboard focus states.

## Advanced Product (+8-12h)

Interactive time picker mode with draggable hands, multiple timezone support with labels, custom color schemes via props, animation speed controls (instant/slow/normal), optional tick marks and numerals, sound effects on hour changes.

---

**Total Documentation Effort**: 2-3 hours | **Dependencies**: None
