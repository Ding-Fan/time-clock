# Task Plan — 24-Hour Visual Time Clock

## Phase 1 — Setup

- [x] T001 Configure Vitest test script in package.json and create vitest.config.ts at /home/ding/Github/time-clock
- [x] T002 Install @testing-library/svelte and vitest environment dependencies in package.json devDependencies

## Phase 2 — Foundational

- [x] T003 Create time utility module for hand angle calculations in src/lib/time/clockAngles.ts
- [x] T004 Create Svelte store for DayState and HourClock data in src/lib/stores/dayState.ts

## Phase 3 — User Story 1 (Visual Time Awareness at a Glance)

- **Goal**: Render 4×6 grid of 24 clocks with past hours dimmed and future/current bright per FR-001 through FR-007.
- **Independent Test**: Load page at known time and verify past hours dim, future/current bright.
- [x] T005 [US1] Create ClockFace component that renders hand-only faces (hour, minute, second) without numerals or tick marks in src/lib/components/ClockFace.svelte
- [x] T006 [US1] Implement 4×6 grid layout and bind HourClock state data in src/routes/+page.svelte
- [x] T007 [US1] Style past vs future clocks with CSS classes in src/routes/+page.svelte and src/app.css

## Phase 4 — User Story 2 (Real-Time Day Progress Updates)

- **Goal**: Current hour animates; past hour transitions at rollover; midnight resets state.
- **Independent Test**: Observe transition around hour change and confirm midnight reset.
- [x] T008 [US2] Add live clock animation logic to ClockFace component in src/lib/components/ClockFace.svelte
- [x] T009 [US2] Implement discrete 1-second tick scheduler for current hour updates in src/lib/stores/dayState.ts
- [x] T010 [US2] Handle hour rollover and midnight reset logic in src/lib/stores/dayState.ts

## Phase 5 — User Story 3 (Clear Hour Labels)

- **Goal**: Display correct HH:00 label under each clock.
- **Independent Test**: Verify labels from 00:00 to 23:00.
- [x] T011 [US3] Ensure HourClock label formatting in src/lib/time/clockAngles.ts
- [x] T012 [US3] Render labels with accessible markup in src/routes/+page.svelte

## Phase 6 — Polish & Cross-Cutting

- [x] T013 Add documentation for new utilities and components in README.md
- [ ] T014 Add unit tests for clock store and components in tests/components/clock.test.ts
- [ ] T015 Verify eslint and svelte-check pass with new code using pnpm lint and pnpm check
- [x] T016 Capture checklist validating SC-001 through SC-005 in README.md or docs/acceptance.md
- [ ] T017 Record lightweight performance snapshot confirming 60 FPS target and <100 ms second-hand latency in docs/acceptance.md

## Dependencies

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

## Parallel Execution Examples

- Pair T001 with T002 (setup packages).
- Work on T005 and T006 in parallel once foundational tasks complete.
- Run T008 and T009 concurrently after store exists.

## Implementation Strategy

- MVP: Complete Phases 1-4 to deliver live clock grid with real-time updates.
- Incrementally add labels (Phase 5) then finalize polish tasks (Phase 6).
