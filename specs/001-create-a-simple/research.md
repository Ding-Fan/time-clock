# Phase 0 Research — 24-Hour Visual Time Clock

## Decision Log

### Testing Stack for Svelte Clock Visualization

- **Decision**: Use Vitest with @testing-library/svelte for component/unit tests, complemented by svelte-check for static analysis.
- **Rationale**: Vitest integrates seamlessly with SvelteKit and Vite, enabling fast DOM-oriented tests via jsdom. @testing-library/svelte offers idiomatic interaction assertions for component behavior, and svelte-check already exists in the toolchain for type/markup validation.
- **Alternatives considered**:
  - Playwright end-to-end tests — heavier setup; reserved for future cross-browser validation if needed.
  - Cypress — adds separate runner and dependencies without immediate layout interactions.

### Performance Target for Animated Clock Grid

- **Decision**: Target 60 FPS rendering with per-frame work under 16 ms, ensuring second-hand ticks render within 100 ms of real time.
- **Rationale**: The current hour clock requires second-by-second animation; keeping frame work under 16 ms aligns with common high-refresh browser expectations and avoids jitter when many hands animate simultaneously.
- **Alternatives considered**:
  - Lower refresh interval (e.g., 500 ms updates) — would introduce visible stutter in the second hand contrary to FR-018.
  - requestAnimationFrame for all 24 clocks — unnecessary overhead; only the active clock needs animation.

### Runtime Constraints

- **Decision**: Avoid adding heavy animation libraries; rely on CSS transforms and requestAnimationFrame for the active clock while precomputing static hand angles for past/future clocks.
- **Rationale**: Reduces bundle size and CPU usage, keeping the experience light for desktop browsers per assumptions. Static clocks can be rendered once, eliminating repeated DOM updates.
- **Alternatives considered**:
  - Integrating D3.js or GSAP — overkill for simple hand rotations and increases complexity.
  - Canvas/WebGL rendering — unnecessary loss of accessibility and harder to test.

### Feature Scope Confirmation

- **Decision**: Scope remains a single SvelteKit page serving individual users in their browser session; no multi-user sync or persistence required.
- **Rationale**: Specification targets a single-page visualization driven by local time. Keeping scope narrow avoids premature backend or storage work.
- **Alternatives considered**:
  - Expanding to multi-user dashboards — outside feature goals.
  - Persisting state server-side — redundant since visualization derives from system time.
