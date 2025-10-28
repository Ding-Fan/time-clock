# Fullscreen Button Specification

## Problem & Solution

**Problem**: Users cannot immersively view the 24-hour clock grid without browser chrome and UI distractions.
**Solution**: System-wide fullscreen toggle button using Fullscreen API, positioned in top-right corner.
**Returns**: Boolean fullscreen state with automatic icon toggle (expand ⇄ compress).

## Component API

```typescript
interface FullscreenButtonProps {
  // No required props - self-contained component
  class?: string; // Optional additional CSS classes
}
```

## Usage Example

```svelte
<!-- In +layout.svelte -->
<script lang="ts">
  import FullscreenButton from '$lib/components/FullscreenButton.svelte';
</script>

<div class="app">
  <Header />
  <main>{@render children()}</main>
  <FullscreenButton />
</div>
```

## Core Flow

```
User clicks button
  ↓
Check current fullscreen state
  ↓
If NOT fullscreen → Call document.documentElement.requestFullscreen()
If IS fullscreen → Call document.exitFullscreen()
  ↓
Listen to 'fullscreenchange' event
  ↓
Update icon (expand ⇄ compress) and aria-label
```

## User Stories

**US-1: Enter Fullscreen**
User views clock grid and wants immersive experience. Clicks top-right button with expand icon. Browser enters fullscreen mode, hiding all chrome. Button icon changes to compress icon.

**US-2: Exit Fullscreen**
User in fullscreen wants to exit. Clicks button (now showing compress icon) or presses ESC key. Browser exits fullscreen. Button icon changes back to expand icon.

**US-3: Keyboard Accessibility**
User navigates with keyboard, tabs to fullscreen button, presses Enter or Space. Fullscreen toggles as expected. Focus visible indicator shows current focus state.

## MVP Scope

**Included**:
- Fixed position button in top-right corner
- Expand/compress SVG icon toggle
- Fullscreen API integration (requestFullscreen/exitFullscreen)
- Fullscreenchange event listener for state sync
- Browser environment check (`$app/environment`)
- Accessible button (aria-label, keyboard support)
- Minimal circular design (transparent, no border)
- Subtle hover/focus states

**NOT Included** (Future):
- Keyboard shortcuts (F11 handler) → 🔧 Robust
- Fade on idle behavior → 🔧 Robust
- Custom position prop → 🔧 Robust
- Configurable animations → 🚀 Advanced
- Theme variants → 🚀 Advanced
- Exit instructions overlay → 🚀 Advanced

## Browser API Details

**Fullscreen API Methods**:
```typescript
// Enter fullscreen
document.documentElement.requestFullscreen(): Promise<void>

// Exit fullscreen
document.exitFullscreen(): Promise<void>

// Check current state
document.fullscreenElement: Element | null
```

**Event Listener**:
```typescript
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement;
  // Update button state
});
```

## Icon Design

**Expand Icon** (enter fullscreen):
```
Four outward-pointing arrows in corners
→ ⤢ ⤡
  ⤡ ⤢ ←
```

**Compress Icon** (exit fullscreen):
```
Four inward-pointing arrows from corners
← ⤢ ⤡
  ⤡ ⤢ →
```

**SVG Requirements**:
- 24×24px viewBox
- 2px stroke width
- currentColor for theme compatibility
- Minimal, geometric style

## Acceptance Criteria (MVP)

**Functional**:
- [x] Button toggles fullscreen on click
- [x] Icon changes based on fullscreen state (expand ⇄ compress)
- [x] ESC key exits fullscreen and updates button state
- [x] Component only renders in browser environment
- [x] Fullscreenchange event listener cleans up on unmount
- [x] Works across Chrome, Firefox, Safari, Edge

**UI/UX**:
- [x] Fixed position top-right corner (16px from edges)
- [x] Fully circular shape (border-radius: 50%)
- [x] Transparent background with no border for minimal appearance
- [x] Subtle color (0.6 opacity) that brightens on hover (0.9 opacity)
- [x] Light background appears only on hover (0.1 opacity)
- [x] Focus visible indicator for keyboard navigation
- [x] Button size minimum 48×48px for touch targets
- [x] Smooth icon transition and scale on hover

**Accessibility**:
- [x] Aria-label describes current action ("Enter fullscreen" / "Exit fullscreen")
- [x] Button focusable via keyboard (Tab key)
- [x] Enter and Space keys trigger toggle
- [x] Focus indicator meets WCAG contrast requirements

**Code Quality**:
- [x] TypeScript strict mode compliance
- [x] No console errors or warnings
- [x] Component follows ClockFace.svelte patterns ($state rune, scoped styles)
- [x] Minimal dependencies (no external icon libraries)
- [x] CSS custom properties for theming (--color-theme-1)

## Future Tiers

**🔧 Robust** (+2-3h): Keyboard shortcut (F11) support, fade-on-idle behavior (show on hover/move), configurable position prop (top-left/top-right/bottom-right), tooltip on hover.

**🚀 Advanced** (+3-4h): Configurable animation styles (fade/slide/scale), multiple theme variants (light/dark/auto), exit instructions overlay for first-time users, localStorage persistence of user preference, mobile-specific adjustments.

---

**Status**: ✅ Implemented | **Actual Effort**: 4 hours | **Completed**: 2025-10-28
