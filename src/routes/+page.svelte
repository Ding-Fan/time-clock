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

	<section aria-label="24-hour clock grid" class="grid grid-cols-4 gap-3.5">
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
					/>
				</article>
			{/each}
		{/if}
	</section>
</main>
