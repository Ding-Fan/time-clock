# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SvelteKit** application using:
- **Svelte 5** (with new runes syntax like `$props()`)
- **TypeScript** with strict type checking
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Vite** as the build tool
- **pnpm** as the package manager
- **ESLint** with TypeScript and Svelte support
- **Prettier** for code formatting

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

### Server vs Client Code

- **`.server.ts` files**: Run only on the server, can access sensitive data
- **`.ts` files without `.server`**: Can run on both client and server
- **Server Actions**: Defined in `+page.server.ts` as `export const actions = { ... }`
- **Page Load Functions**: Export `load` functions from `+page.ts` (client) or `+page.server.ts` (server)

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

## Cookie-Based State Management

The example `sverdle` game demonstrates cookie-based state persistence:
- Game state serialized as string in cookies
- Server actions modify state and update cookies
- Useful pattern for progressive enhancement (works without JS)

## Best Practices

- **Prefer server-side logic for sensitive operations**: Use `+page.server.ts` and form actions
- **Use TypeScript satisfies**: Ensure type safety with `satisfies PageServerLoad` / `satisfies Actions`
- **Component file naming**: Co-located components (like `Counter.svelte` in `routes/`) are capitalized
- **Progressive enhancement**: Server actions work without JavaScript, enhanced with client-side JS when available
