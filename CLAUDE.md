# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **24-Hour Visual Time Clock** - a SvelteKit single-page application that displays a 6×4 grid of 24 analog clocks representing each hour of the current day. Past hours dim and freeze, the current hour animates live with discrete second ticks, and future hours sit at noon.

**Technology Stack**:

- **Svelte 5** (with new runes syntax like `$props()`)
- **TypeScript** with strict type checking
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Vite** as the build tool
- **pnpm** as the package manager
- **ESLint** with TypeScript and Svelte support
- **Prettier** for code formatting
- **Vitest** with Testing Library for unit tests

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start dev server and open in browser
pnpm dev -- --open

# Type checking
pnpm check

# Type checking in watch mode
pnpm check:watch

# Lint code (Prettier + ESLint)
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test tests/stores/dayState.test.ts
```

## Project Structure

### SvelteKit File-Based Routing

This project uses SvelteKit's file-based routing system:

- `src/routes/+page.svelte` - Home page component
- `src/routes/+page.ts` - Page load function (client-side)
- `src/routes/+page.server.ts` - Server-side page load and actions
- `src/routes/+layout.svelte` - Root layout wrapping all pages
- `src/app.html` - HTML template
- `src/app.css` - Global styles with Tailwind imports
- `src/app.d.ts` - TypeScript declarations

### Application-Specific Architecture

This project implements a real-time clock visualization with the following key components:

**Core Business Logic**:

- `src/lib/stores/dayState.ts` - Svelte store managing 24-hour grid state with per-second updates
  - Exports `dayState` store with `start()`, `stop()`, `refresh()`, and `updateCurrentTime()` methods
  - Auto-schedules ticks synchronized to second boundaries via `setTimeout`
  - Derives each hour's state (past/current/future), brightness, and hand angles
- `src/lib/time/clockAngles.ts` - Pure functions calculating clock hand positions
  - `calculateCurrentAngles(date)` - Live analog clock angles with smooth hour hand progression
  - `calculatePastAngles(hourIndex)` - Frozen at end of hour (e.g., 09:00 clock shows 10:00)
  - `calculateFutureAngles(hourIndex)` - All hands point to 12:00 position
- `src/lib/components/ClockFace.svelte` - Reusable analog clock component
  - Accepts `handAngles`, `brightness`, `showSecondHand`, and `progress` props
  - Uses CSS custom properties (`--hand-rotation`, `--elapsed-angle`) for animations
  - Implements conic gradient progress visualization

**State Management Pattern**:

- Single source of truth: `dayState` store updates every second
- Each `HourClock` object contains: `hourIndex`, `label`, `state`, `handAngles`, `brightness`, `isAnimated`, `progress`
- Page components subscribe to `dayState` and render reactively
- Timer lifecycle managed by `dayState.start()` on mount, `dayState.stop()` on unmount

**Testing Infrastructure**:

- Vitest configured with jsdom environment for DOM testing
- Tests located in `tests/` directory mirroring `src/lib/` structure
- Testing Library used for component tests (see `tests/setup.ts`)

### Server vs Client Code

- **`.server.ts` files**: Run only on the server, can access sensitive data
- **`.ts` files without `.server`**: Can run on both client and server
- **Server Actions**: Defined in `+page.server.ts` as `export const actions = { ... }`
- **Page Load Functions**: Export `load` functions from `+page.ts` (client) or `+page.server.ts` (server)
- **Note**: This time-clock app is entirely client-side with no server actions or data fetching

## Svelte 5 Syntax

This project uses **Svelte 5** with the new runes API:

```svelte
<script lang="ts">
  // Props using $props() rune
  let { children } = $props();

  // Render children using {@render}
  {@render children()}
</script>
```

**Key differences from Svelte 4:**

- Use `$props()` instead of `export let`
- Use `{@render children()}` instead of `<slot />`
- Reactive state uses `$state()`, derived values use `$derived()`

## Styling Approach

The project uses a **hybrid styling approach**:

1. **Tailwind CSS v4**: Imported in `src/app.css` via `@import 'tailwindcss'`
2. **Component-scoped `<style>` blocks**: Used in `.svelte` files for component-specific styles
3. **CSS custom properties**: Defined in `:root` in `app.css` for theming

When adding styles:

- Use Tailwind utility classes for common patterns
- Use scoped `<style>` blocks for component-specific layout/design
- Extend CSS variables in `app.css` for theme-level changes

## TypeScript Configuration

- **Strict mode enabled**: All strict TypeScript checks are on
- **Path aliases**: Use `$lib` for `src/lib` (configured by SvelteKit)
- **Module resolution**: Set to `bundler`
- Generated types in `.svelte-kit/tsconfig.json` are automatically extended

## Vite Plugins

The project uses these Vite plugins (configured in `vite.config.ts`):

1. `@tailwindcss/vite` - Tailwind CSS v4 integration
2. `@sveltejs/kit/vite` - SvelteKit plugin
3. `vite-plugin-devtools-json` - Development tooling

## Monorepo Setup

This project uses **pnpm workspaces** (`pnpm-workspace.yaml`):

- `onlyBuiltDependencies: ['esbuild', '@tailwindcss/oxide']` ensures native dependencies are rebuilt for the current platform

## ESLint Configuration

ESLint is configured with:

- TypeScript ESLint for `.ts` files
- Svelte plugin for `.svelte` files
- Prettier integration to avoid conflicts
- **Important**: `no-undef` rule is disabled (TypeScript handles this)
- `.gitignore` patterns are automatically excluded via `@eslint/compat`

## Time-Clock Specific Conventions

**Clock State Types**:

- `'past'` - Hour has completely elapsed, hands frozen at end position
- `'current'` - Currently active hour, live animation with second hand
- `'future'` - Hour hasn't started yet, hands at 12:00 position

**Angle Calculations**:

- All angles in degrees (0-359)
- Use `normalize()` helper to wrap angles to 0-359 range
- Hour hand progresses gradually through the hour based on minutes/seconds
- Second hand updates with discrete ticks (no smooth animation)

**Store Lifecycle**:

- Always call `dayState.start()` in component `onMount`
- Always call `dayState.stop()` in component `onDestroy` to prevent memory leaks
- Use `dayState.refresh(date)` or `updateCurrentTime(date)` for testing with mock dates

**CSS Custom Properties**:

- `--hand-rotation` - Applied to each clock hand for rotation
- `--elapsed-angle` - Controls conic gradient progress visualization (0-360 degrees)
- `--clock-*` variables - Define colors for hands, face, and center cap (see `app.css`)

## Best Practices

- **Component file naming**: Co-located components (like `Counter.svelte` in `routes/`) are capitalized
- **Test time-dependent code**: Use `dayState.updateCurrentTime(mockDate)` instead of relying on system time
- **Avoid manual DOM manipulation**: Leverage Svelte's reactivity and CSS custom properties for animations
- **Keep angle calculations pure**: All functions in `clockAngles.ts` should be side-effect-free for testability

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
