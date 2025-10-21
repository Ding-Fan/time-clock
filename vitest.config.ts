import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['tests/setup.ts']
	}
});
