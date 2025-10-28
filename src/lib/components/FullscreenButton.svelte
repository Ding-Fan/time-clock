<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	let isFullscreen = $state(false);

	function handleFullscreenChange() {
		isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
	}

	async function toggleFullscreen() {
		if (!browser) return;

		try {
			if (isFullscreen) {
				if (document.exitFullscreen) {
					await document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					await document.webkitExitFullscreen();
				}
			} else {
				const element = document.documentElement;
				if (element.requestFullscreen) {
					await element.requestFullscreen();
				} else if (element.webkitRequestFullscreen) {
					await element.webkitRequestFullscreen();
				}
			}
		} catch (error) {
			// Silently fail - user may have denied permission or API is unavailable
			console.warn('Fullscreen toggle failed:', error);
		}
	}

	onMount(() => {
		if (!browser) return;
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
	});

	onDestroy(() => {
		if (!browser) return;
		document.removeEventListener('fullscreenchange', handleFullscreenChange);
		document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
	});
</script>

<button
	class="fullscreen-button"
	onclick={toggleFullscreen}
	aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
	type="button"
>
	{#if isFullscreen}
		<!-- Compress Icon (exit fullscreen) -->
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
		</svg>
	{:else}
		<!-- Expand Icon (enter fullscreen) -->
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
		</svg>
	{/if}
</button>

<style>
	.fullscreen-button {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9999;
		padding: 0.75rem;
		border-radius: 50%;
		background-color: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 48px;
		min-height: 48px;
	}

	.fullscreen-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
	}

	.fullscreen-button:focus-visible {
		outline: 2px solid var(--color-theme-1);
		outline-offset: 2px;
	}

	svg {
		transition: transform 0.2s ease;
		display: block;
	}

	.fullscreen-button:hover svg {
		transform: scale(1.1);
	}
</style>
