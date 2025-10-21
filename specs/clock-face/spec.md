# ClockFace Component Specification

## Problem & Solution

**Problem**: Need a reusable analog clock component to visualize time states (past/current/future) in the 24-hour grid with dynamic hand positions, brightness control, and progress indication.

**Solution**: Presentation component accepting hand angles, brightness state, second hand visibility, and progress value. Uses CSS custom properties for dynamic rotation and conic gradient visualization.

**Returns**: Visual analog clock with three hands (hour, minute, second), dimming capability, and circular progress overlay.

## Component API

```typescript
import type { ClockHandAngles } from '../time/clockAngles';
import type { Brightness } from '../stores/dayState';

interface ClockFaceProps {
	handAngles: ClockHandAngles; // { hour: 0-359, minute: 0-359, second: 0-359 }
	brightness?: Brightness; // 'normal' | 'dim' (default: 'normal')
	showSecondHand?: boolean; // Show/hide second hand (default: true)
	progress?: number; // 0-1 for conic gradient overlay (default: 0)
}
```

## Usage Example

```svelte
<script lang="ts">
	import ClockFace from '$lib/components/ClockFace.svelte';
	import type { ClockHandAngles } from '$lib/time/clockAngles';

	const handAngles: ClockHandAngles = { hour: 90, minute: 180, second: 270 };
</script>

<ClockFace {handAngles} brightness="normal" showSecondHand={true} progress={0.5} />
```

## Core Flow

```
Props received
  ↓
Clamp progress (0-1)
  ↓
Apply CSS custom properties (--hand-rotation, --elapsed-angle)
  ↓
Render clock face with hands rotated, brightness applied, progress overlay
```

## Visual Structure

```
┌─────────────────────────────────┐
│   .clock-face (white border)    │ ← 6px white border + multi-layer shadows
│   ┌───────────────────────┐     │
│   │ ::before (progress)   │     │ ← Conic gradient (gray fill from 12 o'clock)
│   ├───────────────────────┤     │
│   │ .clock-face__dial     │     │
│   │   ├─ hour shadow      │     │ ← Blurred gray shadow (offset -5px, -5px)
│   │   ├─ minute shadow    │     │ ← Blurred gray shadow (offset -5px, -5px)
│   │   ├─ second shadow    │     │ ← Blurred gray shadow (offset -5px, 5px)
│   │   ├─ hour hand        │     │ ← Dark gray rounded rectangle
│   │   ├─ minute hand      │     │ ← Dark gray rounded rectangle
│   │   ├─ big center cap   │     │ ← 30px dark gray circle with shadow
│   │   ├─ second hand      │     │ ← Red thin hand (on top)
│   │   └─ small center cap │     │ ← 10px red circle with shadow (topmost)
│   └───────────────────────┘     │
└─────────────────────────────────┘

Visual States:
- Past (completed): White background + FULL gray overlay + dim (35% opacity)
- Current (in progress): White background + PARTIAL gray overlay (filling) + shake animation
- Future (not started): White background + NO gray overlay

Design Elements:
- Border: 20% rounded rectangle (not circle) with thick white border
- Shadows: Multi-layer box shadows for 3D depth effect
- Hands: Thick rounded rectangles, not thin lines
- Center caps: Two-layer (big gray + small red on top)
- Animation: Shake effect with cubic-bezier for realistic ticking
```

## User Stories

**US-1: Display Current Time**
User views current hour clock showing live time with animated second hand. Gray overlay fills clockwise from 12 o'clock as the hour progresses. Hour hand progresses smoothly through the hour based on minutes/seconds, minute hand updates per minute, second hand ticks discretely.

**US-2: Show Past Hour State**
User views completed hour clock with white background fully covered by gray overlay (100% progress), dimmed to 35% opacity, hands frozen at end position (e.g., 09:00 clock shows 10:00). No second hand displayed. Visual metaphor: "filled in/done".

**US-3: Show Future Hour State**
User views upcoming hour clock at normal brightness with clean white background (no gray overlay), hour hand pointing to the start of that hour (e.g., 3 PM clock shows hour hand at 3), minute and second hands at 12:00. No second hand displayed. Visual metaphor: "ready/waiting for its time".

## MVP Scope

**Included**:

- Hand rotation via CSS custom properties
- Brightness states (normal, dim)
- Conditional second hand rendering
- Progress visualization (conic gradient 0-360°)
- White background with 3D border effect
- Two-layer center caps (big gray + small red)
- Shadow hands for depth effect
- Shake animation for realistic ticking
- Aspect ratio 1:1, fixed width 7.5rem
- Hybrid styling: Tailwind for layout + scoped CSS for animations

**NOT Included** (Future):

- Configurable sizes → 🔧 Robust
- Theme variants → 🔧 Robust
- Svelte 5 migration → 🔧 Robust
- Interactive controls → 🚀 Advanced
- Multiple time zones → 🚀 Advanced
- Custom themes via props → 🚀 Advanced

## CSS Custom Properties

**Component Variables**:

- `--hand-rotation`: Applied to each hand for rotation (0-359deg)
- `--elapsed-angle`: Controls conic gradient progress (0-360deg, starts at 12 o'clock)

**Themeable Variables** (defined in `app.css`):

- `--clock-face-bg`: Clock face background color (default: rgba(255, 255, 255, 0.95))
- `--clock-border-width`: Border width (default: 4px)
- `--clock-border-color`: Border color (default: white)
- `--clock-progress-fill`: Gray overlay color for progress (default: rgba(100, 100, 100, 1.0))
- `--clock-hour-hand`: Hour hand color (default: rgb(81, 81, 81) dark gray)
- `--clock-minute-hand`: Minute hand color (default: rgb(81, 81, 81) dark gray)
- `--clock-second-hand`: Second hand color (default: rgb(174, 79, 78) red)

**Note**: Border created entirely with box-shadow (no CSS border property). Center cap colors are hardcoded in Tailwind classes.

## Component Behavior

**Hand Dimensions**:

- Hour: 35% width × 8px height (thin rounded rectangle)
- Minute: 45% width × 8px height (thin rounded rectangle)
- Second: 48% width × 2px height (very thin rounded rectangle)
- All hands: 10px border-radius for rounded ends

**Shadow Layer**:

- Color: rgba(50, 50, 50, 0.4) (dark semi-transparent gray)
- Filter: blur(2.1px)
- Offset: -5px horizontal for all hands
- Renders behind actual hands for depth effect
- Darker than progress overlay for visual hierarchy

**Center Caps**:

- Big cap: 20px diameter, dark gray (rgb(81, 81, 81)), 2px shadow
- Small cap: 6px diameter, red (rgb(174, 79, 78)), 1px shadow
- Small cap on top (z-index: 10)

**Transitions**:

- All hands: `all 0.05s cubic-bezier(0, 1.39, 0.7, 1.49)` (shake effect for realistic ticking)
- Progress overlay: `background 0.35s linear`

**Brightness States**:

- Normal: `opacity: 1.0`
- Dim: `opacity: 0.35`

**Progress Visualization**:

- Clamped to 0-1 range
- Converted to 0-360 degrees for conic gradient
- Gradient starts at 12 o'clock (`from 0deg`), fills clockwise
- Gray overlay color: `rgba(100, 100, 100, 1.0)` (full opacity medium gray)
- Overlay inset: 0 (covers entire clock face)
- Overlay opacity calculated: `clamp(0, angle/360, 1)` fades in as it fills
- Progress 0 = clean white face, Progress 1 = fully gray face
- Color chosen to match visual appearance of dimmed past clocks (consistency)

**Coordinate System Notes**:

- **Conic-gradient**: `0deg` = 12 o'clock (top), rotates clockwise
- **Transform rotate**: `0deg` = 3 o'clock (right), requires `-90deg` offset for 12 o'clock positioning
- Clock hands use `rotate(calc(var(--hand-rotation) - 90deg))` to align with clock face

**Cumulative Rotation (Anti-Flicker)**:

- Angles calculated cumulatively from start of day, not normalized to 0-359°
- Second hand: `totalSecondsToday * 6°` (grows from 0° to 518,400° in 24h)
- Minute hand: `totalMinutesToday * 6°` (grows from 0° to 8,640° in 24h)
- Hour hand: Progressive through day based on total time
- Prevents flicker at 360°→0° transitions (e.g., second hand at :00)
- CSS `rotate()` handles any degree value, no need for modulo

**Border Styling**:

- Border radius: 50% (perfect circle)
- No CSS border property - uses box-shadow instead for flexibility
- Multi-layer box shadows:
  - White border ring: `0 0 0 4px white`
  - Outer dark ring: `0 0 4px 5px rgba(0, 0, 0, 0.1)`
  - Inset light ring: `inset 0 0 3px 2px #e0e0e0`
  - Outer subtle shadow: `0 0 2px rgba(0, 0, 0, 0.2)`

**Styling Approach (Hybrid)**:

- **Tailwind CSS**: Layout (positioning, sizing, spacing, rounded corners, transforms)
  - Examples: `absolute`, `top-1/2`, `left-1/2`, `w-[20px]`, `rounded-full`, `-translate-x-1/2`
- **Scoped CSS**: Complex features (animations, gradients, box-shadows, pseudo-elements, CSS variables)
  - Examples: Multi-layer box-shadow, conic-gradient, cubic-bezier transitions, hand rotations
- **Hybrid benefits**: Clean, scannable markup + maintainable complex animations

## Acceptance Criteria (MVP)

**Functional**:

- [ ] Accepts `handAngles` and rotates all three hands correctly with -90deg offset
- [ ] Hands point correctly: 0° input = 12 o'clock (top), 90° input = 3 o'clock (right)
- [ ] Cumulative rotation prevents flicker at second hand :00 transition
- [ ] Brightness prop toggles between normal and dim opacity (35%)
- [ ] showSecondHand conditionally renders second hand (both actual and shadow)
- [ ] Progress value generates conic gradient from 0-360 degrees starting at 12 o'clock
- [ ] Progress values outside 0-1 range are clamped
- [ ] All CSS custom properties apply correctly

**UI/UX**:

- [ ] Clock maintains 1:1 aspect ratio at all viewport sizes
- [ ] All hands have shake animation (0.05s cubic-bezier bounce)
- [ ] Dim state reduces opacity to 35%
- [ ] Progress overlay visible, accurate, and starts at 12 o'clock
- [ ] Two-layer center caps visible (big gray 20px, small red 6px)
- [ ] Small center cap renders on top of all hands (z-index: 10)
- [ ] Component size is 7.5rem with max-width 100%
- [ ] Shadow hands visible and offset correctly for depth effect

**Integration**:

- [ ] Works with ClockHandAngles type from clockAngles.ts (cumulative angles)
- [ ] Works with Brightness type from dayState.ts
- [ ] Renders correctly in 4-column grid layout as direct child
- [ ] No console errors or warnings
- [ ] Border created with box-shadow works in all modern browsers
- [ ] Cumulative rotation angles don't cause performance issues

## Future Tiers

**🔧 Robust** (+4-6h): Svelte 5 migration ($props rune), configurable sizes (sm/md/lg), theme variants (light/dark/custom), accessibility (ARIA labels, reduced motion), keyboard navigation.

**🚀 Advanced** (+8-12h): Interactive time picker mode, multiple time zones with labels, custom color schemes via props, animation speed controls, tick marks and numerals, sound effects.

---

**Status**: Existing Implementation | **Documentation Effort**: 2-3h
