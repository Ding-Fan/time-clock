# Page Layout Specification

## Problem & Solution

**Problem**: Current 6×4 clock grid exceeds viewport height (~720px for 6 rows) causing unwanted scrolling on desktop screens. Layout doesn't adapt to screen orientation.

**Solution**: Orientation-aware responsive grid using CSS media queries. Landscape displays 6 columns × 4 rows, portrait displays 4 columns × 6 rows. Dynamic viewport-based sizing ensures grid fits 100vh without scrolling. Grid centered horizontally and vertically.

**Returns**: Responsive, scrollbar-free page layout that adapts to screen orientation while maintaining visual hierarchy.

## Layout Specifications

**Landscape Mode** (width > height):
```
Grid: 6 columns × 4 rows
Total clocks: 24 (arranged left-to-right, top-to-bottom)
Alignment: Centered horizontally and vertically
Max height: 100vh
```

**Portrait Mode** (height > width):
```
Grid: 4 columns × 6 rows
Total clocks: 24 (arranged left-to-right, top-to-bottom)
Alignment: Centered horizontally and vertically
Max height: 100vh
```

## Dynamic Sizing Strategy

**Fluid Calculation Approach**:
```
Clock size determined by whichever dimension is most constraining:
- Calculate from width:  (100vw - gaps - padding) / columns
- Calculate from height: (100vh - gaps - padding) / rows
- Use minimum of both calculations
- Clamp between 80px (min) and 180px (max)
```

**Parameters**:
```
Grid gap:       16px
Page padding:   5rem (80px on all sides)
Min clock size: 80px
Max clock size: 180px
```

**Rationale**:
- Fluid sizing adapts to both width AND height
- Clocks never appear disproportionately small on wide screens
- No stepped breakpoints - smooth scaling
- Simpler implementation (~30 lines vs ~90 lines)
- Guaranteed to fit viewport (no scrollbar)
- Clocks maintain 1:1 aspect ratio

## Visual Structure

**Landscape Layout**:
```
┌─────────────────────────────────────────┐
│              [Header]                   │
├─────────────────────────────────────────┤
│                                         │
│     [00] [01] [02] [03] [04] [05]      │  ← Row 1 (centered)
│     [06] [07] [08] [09] [10] [11]      │  ← Row 2
│     [12] [13] [14] [15] [16] [17]      │  ← Row 3
│     [18] [19] [20] [21] [22] [23]      │  ← Row 4
│                                         │
└─────────────────────────────────────────┘
```

**Portrait Layout**:
```
┌────────────────────┐
│    [Header]        │
├────────────────────┤
│                    │
│  [00] [01] [02] [03]  │  ← Row 1 (centered)
│  [04] [05] [06] [07]  │  ← Row 2
│  [08] [09] [10] [11]  │  ← Row 3
│  [12] [13] [14] [15]  │  ← Row 4
│  [16] [17] [18] [19]  │  ← Row 5
│  [20] [21] [22] [23]  │  ← Row 6
│                    │
└────────────────────┘
```

## Core Flow

```
Page loads
  ↓
Detect screen orientation (landscape/portrait)
  ↓
Apply appropriate grid layout (6×4 or 4×6)
  ↓
Calculate available viewport height
  ↓
Compute dynamic clock size and gaps
  ↓
Center grid horizontally and vertically
  ↓
Render 24 clocks in grid order
  ↓
Listen for orientation change
  ↓
Re-layout if orientation changes
```

## User Stories

**US-1: Landscape Desktop Viewing**
User opens page on landscape desktop monitor (1920×1080). Page displays 6-column × 4-row grid centered on screen with clocks sized dynamically to fill viewport height without scrolling. All 24 clocks visible, grid centered both horizontally and vertically.

**US-2: Portrait Display Viewing**
User opens page on portrait display or rotates tablet to vertical orientation. Layout automatically switches to 4-column × 6-row grid. Clocks resize to fit within viewport height without scrolling. Grid remains centered.

**US-3: Orientation Change Handling**
User rotates device or resizes browser window causing orientation change. Grid layout transitions smoothly from 6×4 to 4×6 (or vice versa). No scrollbar appears, clocks resize dynamically, centering maintained.

## MVP Scope

**Included**:
- Orientation detection via CSS media query `@media (orientation: portrait)`
- Dynamic grid switching (6×4 landscape, 4×6 portrait)
- Viewport-based sizing with CSS `vh` units
- Proportional gap sizing (12% of clock size)
- Horizontal and vertical centering
- Min/max clock size constraints (80px-150px)
- Smooth layout transitions
- Integration with existing ClockFace component
- dayState store integration (no changes needed)

**NOT Included** (Future):
- Custom breakpoints for tablet sizes → 🔧 Robust
- Alternative layout options (3×8, 2×12) → 🔧 Robust
- Layout transition animations → 🔧 Robust
- User-selectable layout override → 🚀 Advanced
- Zoom controls → 🚀 Advanced
- Saved layout preferences → 🚀 Advanced

## CSS Implementation Strategy

**Layout Hierarchy**:
```css
/* Parent container (+layout.svelte) */
.app {
  min-height: 100vh;  /* Full viewport height */
}

main {
  flex: 1;            /* Fill available space */
}

/* Page container (+page.svelte) */
.page {
  flex: 1;                    /* Fill parent */
  padding: 5rem;              /* Generous whitespace */
  box-sizing: border-box;
  justify-content: center;    /* Vertical centering */
  align-items: center;        /* Horizontal centering */
}

/* Clock card centering */
.clock-card {
  display: flex;
  justify-content: center;    /* Center clock in cell */
  align-items: center;
}
```

**Dynamic Grid Sizing**:
```css
.clock-grid {
  --cols: 6;
  --rows: 4;
  --gap-count-x: 5;           /* 6 columns = 5 gaps */
  --gap-count-y: 3;           /* 4 rows = 3 gaps */
  --gap-size: 16px;
  --page-padding: 5rem;       /* Must match .page padding */
  --min-clock-size: 80px;
  --max-clock-size: 180px;

  /* Calculate max size from width */
  --size-from-width: calc(
    (100vw - (var(--gap-count-x) * var(--gap-size)) - (2 * var(--page-padding))) / var(--cols)
  );

  /* Calculate max size from height */
  --size-from-height: calc(
    (100vh - (var(--gap-count-y) * var(--gap-size)) - (2 * var(--page-padding))) / var(--rows)
  );

  /* Use whichever is smaller (most constraining) */
  --clock-size: clamp(
    var(--min-clock-size),
    min(var(--size-from-width), var(--size-from-height)),
    var(--max-clock-size)
  );

  display: grid;
  grid-template-columns: repeat(6, var(--clock-size));
  gap: var(--gap-size);
  justify-content: center;
  align-content: center;
  transition: grid-template-columns 0.3s ease, gap 0.3s ease;
}

/* Portrait orientation: Update calculations for 4×6 */
@media (orientation: portrait) {
  .clock-grid {
    --cols: 4;
    --rows: 6;
    --gap-count-x: 3;         /* 4 columns = 3 gaps */
    --gap-count-y: 5;         /* 6 rows = 5 gaps */
    grid-template-columns: repeat(4, var(--clock-size));
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .clock-grid { transition: none; }
}
```

## Acceptance Criteria (MVP)

**Functional**:
- [x] Landscape layout displays 6 columns × 4 rows
- [x] Portrait layout displays 4 columns × 6 rows
- [x] Orientation change triggers layout switch
- [x] No vertical scrollbar appears on desktop (1080p, 1440p, 4K)
- [x] All 24 clocks render in correct order
- [x] Clock order unchanged between orientations (00-23 left-to-right, top-to-bottom)
- [x] Dynamic sizing scales with both viewport width and height
- [x] Clocks clamped between 80px-180px range

**UI/UX**:
- [x] Grid centered horizontally and vertically
- [x] Individual clocks centered within grid cells
- [x] 5rem (80px) padding around page for whitespace
- [x] Fixed 16px gap between clocks
- [x] Smooth transitions on resize (0.3s ease)
- [x] Respects prefers-reduced-motion
- [x] Clocks maintain 1:1 aspect ratio
- [x] Clocks scale proportionally on wide screens (no "too small at 1111px width" issue)
- [x] Works on Chrome, Firefox, Safari, Edge

**Integration**:
- [x] ClockFace renders correctly at all dynamically calculated sizes
- [x] dayState store integration unchanged
- [x] Hour labels display properly (inherited from existing implementation)
- [x] Progress overlays work correctly at all sizes
- [x] No console errors or warnings

## Future Tiers

**🔧 Robust** (+3-4h): Tablet breakpoints (3×8 grid for medium screens), configurable gap ratio via CSS custom property, smooth transition animations between layouts, responsive font sizes for hour labels.

**🚀 Advanced** (+6-8h): User-selectable layout override (force 6×4 or 4×6), zoom controls (80%-120%), alternative grid patterns (3×8, 2×12, honeycomb), layout preference persistence (localStorage), keyboard shortcuts for layout switching.

---

**Status**: Implemented | **Actual Effort**: 4 hours
