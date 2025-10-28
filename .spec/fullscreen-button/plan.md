# Fullscreen Button Implementation Plan

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Component Location** | `src/lib/components/FullscreenButton.svelte` | Reusable component follows existing ClockFace pattern |
| **Props Pattern** | `export let` syntax (not `$props()`) | Matches ClockFace.svelte style, minimal props needed |
| **State Management** | Local `$state()` rune for isFullscreen | Svelte 5 reactivity, no need for global store |
| **Browser Check** | `browser` from `$app/environment` | Consistent with +page.svelte pattern (lines 5, 14, 19) |
| **Styling Approach** | Tailwind utilities + scoped CSS | Hybrid pattern used throughout project (app.css + component styles) |
| **Icon Implementation** | Inline SVG with conditional rendering | No external icon library, keeps bundle small |
| **Positioning** | `fixed` with top-right coordinates | Non-intrusive, standard UI pattern, stays visible during scroll |

## Codebase Integration Strategy

**Component Location**: `src/lib/components/FullscreenButton.svelte`
- Follows existing structure (ClockFace.svelte already in this directory)
- Reusable across layouts and pages

**Layout Integration**:
- Add to `src/routes/+layout.svelte` after `<main>` (line 13)
- Button becomes system-wide, appears on all pages
- Fixed positioning ensures it floats above content

**Styling Integration**:
- Use existing CSS custom properties from `app.css`:
  - `--color-theme-1` for focus indicator
- Minimal transparent design with no border
- Fully circular shape (border-radius: 50%)
- Subtle opacity (0.6) with hover brightening (0.9)
- Light background only on hover (0.1 opacity)

**TypeScript Integration**:
- Strict mode enabled (project default)
- Use DOM types: `Document.fullscreenElement`, `Element.requestFullscreen()`
- No new types needed (component is self-contained)

## Technical Approach

**Existing Patterns to Follow**:
1. **Svelte 5 Syntax**: Study `ClockFace.svelte:1-15` for component structure (`export let`, conditional rendering)
2. **Browser Environment**: Use `browser` check like `+page.svelte:14-15` (only run client-side logic)
3. **Event Handlers**: Follow `onMount`/`onDestroy` lifecycle pattern from `+page.svelte:13-21`
4. **Styling**: Hybrid Tailwind + scoped CSS like `ClockFace.svelte:17-144` and `+page.svelte:57-161`

**Component Composition**:
```
FullscreenButton
├── <button> with click handler
│   ├── [Conditional] Expand Icon SVG (when NOT fullscreen)
│   ├── [Conditional] Compress Icon SVG (when IS fullscreen)
│   └── Dynamic aria-label based on state
└── <style> scoped CSS for positioning, animations
```

**Fullscreen API Flow**:
```
onMount
  ↓
Check browser environment
  ↓
Add 'fullscreenchange' event listener
  ↓
On button click → toggleFullscreen()
  ↓
  ├─ If fullscreen: document.exitFullscreen()
  └─ If NOT fullscreen: document.documentElement.requestFullscreen()
  ↓
'fullscreenchange' event fires
  ↓
Update isFullscreen state (!!document.fullscreenElement)
  ↓
Svelte reactivity updates icon + aria-label
  ↓
onDestroy → Remove event listener
```

**State Management**:
```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  let isFullscreen = $state(false);

  function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
  }

  function toggleFullscreen() {
    if (!browser) return;
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  onMount(() => {
    if (!browser) return;
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  });

  onDestroy(() => {
    if (!browser) return;
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
</script>
```

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| **Browser compatibility** | Test across Chrome, Firefox, Safari, Edge; gracefully hide button if API unavailable |
| **iOS Safari limitations** | Fullscreen API limited on iOS; detect and conditionally render button |
| **Z-index conflicts** | Use high z-index (9999) to ensure button stays above all content |
| **Event listener memory leak** | Properly clean up in `onDestroy` (follow +page.svelte pattern) |
| **ESC key not updating state** | `fullscreenchange` event handles all exits (ESC, button, programmatic) |

## Integration Points

**Layout File**: `src/routes/+layout.svelte`
**Styling Context**: `src/app.css` (CSS custom properties)
**Environment Utility**: `$app/environment` (SvelteKit built-in)

## Success Criteria

**Technical**:
- Component renders only in browser environment
- No console errors or memory leaks
- Event listener properly cleaned up on unmount
- TypeScript strict mode passes

**User**:
- Button visible and clickable in top-right corner
- Fullscreen toggles smoothly without flicker
- ESC key exits fullscreen and button reflects state
- Keyboard accessible (Tab, Enter, Space)

**Business**:
- Immersive clock viewing experience
- Professional UI matching design standards
- Zero dependencies added to project

## Robust Product (+2-3h)

Keyboard shortcut (F11 preventDefault + toggle), fade-on-idle (3s timeout, show on mousemove/hover), configurable position prop (`top-left | top-right | bottom-right`), tooltip on hover ("Press F11 or click to toggle fullscreen").

## Advanced Product (+3-4h)

Configurable animation presets (`fade | slide | scale | none`), theme variants (`light | dark | auto` matching system), first-time user overlay with instructions and "Don't show again" checkbox, localStorage persistence (`fullscreen-preference`), mobile-specific UX (larger touch target, bottom-right position).

---

**Status**: ✅ Implemented | **Actual Effort**: 4 hours | **Dependencies**: None | **Completed**: 2025-10-28
