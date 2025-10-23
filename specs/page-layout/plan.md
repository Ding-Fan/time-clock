# Page Layout Implementation Plan

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Orientation Detection** | CSS `@media (orientation: portrait)` | Pure CSS solution, no JavaScript needed, instant response to orientation changes |
| **Grid System** | CSS Grid with dynamic column widths | Uses CSS custom properties with `repeat(6, var(--clock-size))` |
| **Sizing Strategy** | Dynamic calc() + min() + clamp() | Considers both width AND height constraints, fluid scaling, no breakpoints needed |
| **Calculation Basis** | Both viewport dimensions | `min(size-from-width, size-from-height)` uses whichever is most constraining |
| **Centering Strategy** | CSS Grid `justify-content: center` and `align-content: center` | Works directly on grid container, clean and simple |
| **Gap Sizing** | Fixed 16px | Constant gap size, padding provides overall spacing |
| **Page Padding** | 5rem (80px) on all sides | Creates generous whitespace, accounted for in size calculations |

## Codebase Integration Strategy

**Component Location**: `src/routes/+page.svelte`
- Update grid classes from fixed `grid-cols-4` to dynamic
- Add CSS custom properties for sizing calculations
- Maintain existing dayState integration (no changes)

**Layout Integration**:
- Parent container (`+layout.svelte`) already uses flexbox
- Add centering properties: `justify-content: center`, `align-items: center`
- Preserve existing padding and max-width constraints

**Styling Approach**:
- Follow existing hybrid: Tailwind for structure + scoped CSS for calculations
- Add `<style>` block in `+page.svelte` for viewport math
- Use CSS custom properties for reusable values

**ClockFace Compatibility**:
- Current: Fixed `w-[7.5rem]` (120px)
- New: Inherits size from grid column width
- ClockFace already uses `max-w-full` and `aspect-square` (compatible)
- No changes needed to ClockFace component itself

## Technical Approach

**Existing Patterns to Follow**:
1. **Grid Layout**: Study `+page.svelte` line 35 - currently `grid grid-cols-4 gap-3.5`
2. **Scoped CSS**: ClockFace uses scoped `<style>` for animations - follow this pattern for media queries
3. **Media Queries**: Use standard CSS media queries in scoped `<style>`, not Tailwind responsive classes
4. **Fixed Sizing**: Explicit pixel values for predictability (similar to ClockFace's `w-[7.5rem]`)

**Component Composition**:
- `+layout.svelte`: Outer container (minimal changes, already has flex)
- `+page.svelte`: Grid container with preset sizes and media queries
- `ClockFace`: Individual clock (unchanged, inherits sizing from grid)

**Breakpoint Selection Flow**:
```
1. Browser evaluates viewport height
2. Matching media query activates (max-height)
3. Grid columns and gap set to preset values
4. Orientation media query overrides column count if needed
5. Grid auto-sizes to content, parent centers it
```

**Dynamic Size Calculation**:

```
Example: 1920×1080 screen (landscape)

Width calculation:
  (1920px - 5×16px gaps - 2×80px padding) / 6 columns = 293px

Height calculation:
  (1080px - 3×16px gaps - 2×80px padding) / 4 rows = 233px

Result:
  min(293px, 233px) = 233px
  clamp(80px, 233px, 180px) = 180px (max cap applied)

Final clock size: 180px

---

Example: 1366×768 screen (landscape)

Width: (1366 - 80 - 160) / 6 = 187px
Height: (768 - 48 - 160) / 4 = 140px
Result: clamp(80, min(187, 140), 180) = 140px

Final clock size: 140px

---

Example: 800×1200 screen (portrait, 4×6 grid)

Width: (800 - 48 - 160) / 4 = 148px
Height: (1200 - 80 - 160) / 6 = 160px
Result: clamp(80, min(148, 160), 180) = 148px

Final clock size: 148px
```

All calculations guarantee fit within viewport with generous padding.

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| **Clocks too small on constrained viewports** | 80px minimum enforced via clamp(), tested on small screens |
| **Performance impact of calc() on resize** | Negligible per research; CSS calc with custom properties is performant in modern browsers |
| **100vw includes scrollbar width** | Layout uses flex with centering; grid smaller than viewport prevents scrollbar from appearing |
| **Orientation change causes layout jump** | CSS transitions (0.3s ease) smooth the change; variables recalculate automatically |
| **Padding eating too much space on small screens** | Could add responsive padding (e.g., 2rem on mobile) as future enhancement |

## Integration Points

**Files Modified**:
- `src/routes/+page.svelte`: Added scoped CSS grid with media queries, centered .page container
- `src/routes/+layout.svelte`: Removed padding from main element to prevent overflow
- `src/lib/components/ClockFace.svelte`: Changed from `w-[7.5rem]` to `w-full h-full` for dynamic sizing

**Files Unchanged**:
- `src/lib/stores/dayState.ts`: No layout concerns
- `src/app.css`: Global styles remain the same

**Dependencies**: None (pure CSS solution)

## Success Criteria

**Technical**:
- No vertical scrollbar at 1080p (1920×1080), 1440p (2560×1440), 4K (3840×2160)
- Layout switches instantly on orientation change
- Clock size scales fluidly with viewport dimensions
- No JavaScript needed for layout (pure CSS with calc/min/clamp)
- Performance equivalent to media query approach

**User**:
- Clocks immediately visible without scrolling
- Grid visually centered on page
- Smooth orientation transitions
- Consistent spacing across all screen sizes

**Business**:
- Desktop-first experience optimized
- Professional, polished layout
- Reduces user friction (no scrolling)
- Scales to portrait displays (tablets, vertical monitors)

## Robust Product (+3-4h)

Tablet breakpoints (3×8 grid at 768px-1024px), configurable gap ratio, smooth CSS transitions between layouts, responsive hour label font sizes, reduced gap on very small displays.

## Advanced Product (+6-8h)

User-selectable layout override toggle, zoom slider (80%-120%), alternative patterns (3×8, 2×12, honeycomb), localStorage persistence, keyboard shortcuts (G to toggle grid), fullscreen mode.

---

**Total MVP Effort**: 4 hours (actual) | **Dependencies**: None
