<script lang="ts">
	import type { ClockHandAngles } from '../time/clockAngles';
	import type { Brightness } from '../stores/dayState';

	export let handAngles: ClockHandAngles;
	export let brightness: Brightness = 'normal';
	export let showSecondHand = true;
	export let progress = 0;

	$: clampedProgress = Math.max(0, Math.min(1, progress));
</script>

<div
	class={`clock-face relative block w-[7.5rem] max-w-full aspect-square rounded-full  ${brightness === 'dim' ? 'opacity-35' : ''}`}
	style={`--elapsed-angle: ${clampedProgress * 360};`}
	aria-hidden="true"
>
	<div class="clock-face__dial absolute inset-0 z-10">
		<!-- Shadow hands -->
		<span
			class="clock-face__hand clock-face__hand--hour clock-face__hand--shadow absolute top-1/2 left-1/2 rounded-[10px]"
			style={`--hand-rotation: ${handAngles.hour}deg;`}
		></span>
		<span
			class="clock-face__hand clock-face__hand--minute clock-face__hand--shadow absolute top-1/2 left-1/2 rounded-[10px]"
			style={`--hand-rotation: ${handAngles.minute}deg;`}
		></span>
		{#if showSecondHand}
			<span
				class="clock-face__hand clock-face__hand--second clock-face__hand--shadow absolute top-1/2 left-1/2 rounded-[10px]"
				style={`--hand-rotation: ${handAngles.second}deg;`}
			></span>
		{/if}

		<!-- Actual hands -->
		<span
			class="clock-face__hand clock-face__hand--hour clock-face__hand--shake absolute top-1/2 left-1/2 rounded-[10px]"
			style={`--hand-rotation: ${handAngles.hour}deg;`}
		></span>
		<span
			class="clock-face__hand clock-face__hand--minute clock-face__hand--shake absolute top-1/2 left-1/2 rounded-[10px]"
			style={`--hand-rotation: ${handAngles.minute}deg;`}
		></span>

		<!-- Big center cap -->
		<div
			class="absolute top-1/2 left-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_2px_3px_0px_black] bg-[rgb(81,81,81)]"
		></div>

		<!-- Second hand on top -->
		{#if showSecondHand}
			<span
				class="clock-face__hand clock-face__hand--second clock-face__hand--shake absolute top-1/2 left-1/2 rounded-[10px]"
				style={`--hand-rotation: ${handAngles.second}deg;`}
			></span>
		{/if}

		<!-- Small center cap -->
		<div
			class="absolute top-1/2 left-1/2 w-[6px] h-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0px_1px_2px_0px_black] bg-[rgb(174,79,78)] z-10"
		></div>
	</div>
</div>

<style>
	/* Clock face container with 3D border effect */
	.clock-face {
		background: var(--clock-face-bg, rgba(255, 255, 255, 0.95));
		box-shadow: 0 0 4px rgba(30, 30, 30, 0.18);
	}

	/* Progress overlay gradient */
	.clock-face::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: conic-gradient(
			from 0deg,
			rgba(10, 10, 10, .85) calc(var(--elapsed-angle, 0) * 1deg),
			transparent 0
		);
		opacity: clamp(0, calc(var(--elapsed-angle, 0) / 360), 1);
		pointer-events: none;
		z-index: 0;
		transition: background 0.35s linear;
	}

	/* Clock hands - shared properties */
	.clock-face__hand {
		transform-origin: 0 center;
		will-change: transform;
	}

	/* Shake animation for realistic ticking */
	.clock-face__hand--shake {
		transition: all 0.05s cubic-bezier(0, 1.39, 0.7, 1.49);
	}

	/* Hour hand */
	.clock-face__hand--hour {
		width: 35%;
		height: 8px;
		background: var(--clock-hour-hand, rgb(81, 81, 81));
		transform: translateY(-50%) rotate(calc(var(--hand-rotation, 0deg) - 90deg));
	}

	/* Minute hand */
	.clock-face__hand--minute {
		width: 45%;
		height: 8px;
		background: var(--clock-minute-hand, rgb(81, 81, 81));
		transform: translateY(-50%) rotate(calc(var(--hand-rotation, 0deg) - 90deg));
	}

	/* Second hand */
	.clock-face__hand--second {
		width: 48%;
		height: 2px;
		background: var(--clock-second-hand, rgb(174, 79, 78));
		transform: translateY(-50%) rotate(calc(var(--hand-rotation, 0deg) - 90deg));
	}

	/* Shadow layer for depth effect */
	.clock-face__hand--shadow {
		background-color: rgba(50, 50, 50, 0.4);
		filter: blur(2.1px);
	}

	.clock-face__hand--hour.clock-face__hand--shadow,
	.clock-face__hand--minute.clock-face__hand--shadow {
		transform: translate(-5px, -50%) rotate(calc(var(--hand-rotation, 0deg) - 90deg));
	}

	.clock-face__hand--second.clock-face__hand--shadow {
		transform: translate(-5px, calc(-50% + 2px)) rotate(calc(var(--hand-rotation, 0deg) - 90deg));
	}
</style>
