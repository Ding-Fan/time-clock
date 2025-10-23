<script lang="ts">
	import ClockFace from '$lib/components/ClockFace.svelte';
	import { dayState } from '$lib/stores/dayState';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	const stateLabelMap: Record<'past' | 'current' | 'future', string> = {
		past: 'Completed hour',
		current: 'Current hour in progress',
		future: 'Upcoming hour'
	};

	onMount(() => {
		if (!browser) return;
		dayState.start();
	});

	onDestroy(() => {
		if (!browser) return;
		dayState.stop();
	});
</script>

<svelte:head>
	<title>24-Hour Time Clock</title>
	<meta
		name="description"
		content="Visual grid of 24 clocks showing today's hours with past, present, and future states"
	/>
</svelte:head>

<main class="page">
	<header class="page__header"></header>

	<section aria-label="24-hour clock grid" class="clock-grid">
		{#if $dayState}
			{#each $dayState.hours as clock (clock.hourIndex)}
				<article
					class={`clock-card clock-card--${clock.state}`}
					data-state={clock.state}
					aria-label={`${clock.label} — ${stateLabelMap[clock.state]}`}
				>
					<ClockFace
						handAngles={clock.handAngles}
						brightness={clock.brightness}
						showSecondHand={clock.isAnimated}
						progress={clock.progress}
						secondHandOpacity={clock.secondHandOpacity}
						minuteHandOpacity={clock.minuteHandOpacity}
					/>
				</article>
			{/each}
		{/if}
	</section>
</main>

<style>
	/* Page container - enable vertical centering */
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		width: 100%;
		padding: 5rem;
		box-sizing: border-box;
	}

	/* Dynamic grid sizing - landscape (6×4) */
	.clock-grid {
		--cols: 6;
		--rows: 4;
		--gap-count-x: 5; /* 6 columns = 5 gaps */
		--gap-count-y: 3; /* 4 rows = 3 gaps */
		--gap-size: 16px;
		--page-padding: 5rem; /* Padding around the page */
		--min-clock-size: 80px;
		--max-clock-size: 180px;

		/* Calculate max size from width (subtract horizontal padding) */
		--size-from-width: calc(
			(100vw - (var(--gap-count-x) * var(--gap-size)) - (2 * var(--page-padding))) / var(--cols)
		);

		/* Calculate max size from height (subtract vertical padding) */
		--size-from-height: calc(
			(100vh - (var(--gap-count-y) * var(--gap-size)) - (2 * var(--page-padding))) / var(--rows)
		);

		/* Use whichever is smaller (most constraining) */
		--clock-size: clamp(
			var(--min-clock-size),
			min(var(--size-from-width), var(--size-from-height)),
			var(--max-clock-size)
		);

		display: grid;
		grid-template-columns: repeat(6, var(--clock-size));
		gap: var(--gap-size);
		justify-content: center;
		align-content: center;
		transition:
			grid-template-columns 0.3s ease,
			gap 0.3s ease;
	}

	/* Center each clock within its grid cell */
	.clock-card {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Respect reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.clock-grid {
			transition: none;
		}
	}

	/* Portrait orientation: 4×6 layout */
	@media (orientation: portrait) {
		.clock-grid {
			--cols: 4;
			--rows: 6;
			--gap-count-x: 3; /* 4 columns = 3 gaps */
			--gap-count-y: 5; /* 6 rows = 5 gaps */
			grid-template-columns: repeat(4, var(--clock-size));
		}
	}
</style>
