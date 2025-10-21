# 24-Hour Visual Time Clock

SvelteKit single-page experience that renders 24 minimalist analog clocks in a 6×4 grid to visualize how much of today has elapsed. Past hours dim and freeze, the current hour animates live with discrete second ticks, and future hours sit at noon until their time arrives.

## Getting Started

```fish
pnpm install
pnpm dev
```

Open http://localhost:5173 to view the clock grid. The current hour highlights and advances in real time.

## Available Scripts

- `pnpm dev` – run the SvelteKit dev server
- `pnpm check` – run type and Svelte checks
- `pnpm lint` – prettier check + eslint
- `pnpm test` – run Vitest + Testing Library (tests located in `tests/`)

## Project Structure

- `src/lib/components/ClockFace.svelte` – renders a hand-only analog clock
- `src/lib/stores/dayState.ts` – derives hour states and drives per-second updates
- `src/lib/time/clockAngles.ts` – calculates frozen/live clock hand angles
- `src/routes/+page.svelte` – page layout with 24-hour grid
- `src/app.css` – page styling

## Acceptance Checklist (SC-001 – SC-005)

Document manual verification steps:

1. **SC-001 current hour recognition** – page header shows “Current time”; current clock card raised.
2. **SC-002 elapsed count** – header lists “Elapsed hours: N/24”.
3. **SC-003 update latency** – observe second hand tick; hour transition occurs within 5 seconds after the hour.
4. **SC-004 load time** – on broadband, grid renders within 2 seconds (verify via browser network tools).
5. **SC-005 state comprehension** – confirm that dimmed cards + state labels differentiate past/current/future without extra guidance.

Record findings in `docs/acceptance.md` if formal validation is required.
