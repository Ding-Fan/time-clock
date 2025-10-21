import { writable } from 'svelte/store';
import type { ClockHandAngles, ClockState } from '../time/clockAngles';
import { resolveAngles } from '../time/clockAngles';

export type Brightness = 'dim' | 'normal';

export type HourClock = {
	hourIndex: number;
	label: string;
	state: ClockState;
	handAngles: ClockHandAngles;
	brightness: Brightness;
	isAnimated: boolean;
	progress: number;
};

export type DayState = {
	currentDate: Date;
	currentTime: Date;
	currentHourIndex: number;
	elapsedHourCount: number;
	hours: HourClock[];
};

const formatLabel = (hourIndex: number): string => `${hourIndex.toString().padStart(2, '0')}:00`;

const determineState = (hourIndex: number, currentHourIndex: number): ClockState => {
	if (hourIndex < currentHourIndex) return 'past';
	if (hourIndex > currentHourIndex) return 'future';
	return 'current';
};

const determineBrightness = (state: ClockState): Brightness => 'normal';

const determineProgress = (state: ClockState, currentTime: Date): number => {
	if (state === 'past') return 1;
	if (state === 'future') return 0;
	const secondsIntoHour = currentTime.getMinutes() * 60 + currentTime.getSeconds();
	return Math.min(1, Math.max(0, secondsIntoHour / 3600));
};

const buildHourClock = (
	hourIndex: number,
	currentHourIndex: number,
	currentTime: Date
): HourClock => {
	const state = determineState(hourIndex, currentHourIndex);
	return {
		hourIndex,
		label: formatLabel(hourIndex),
		state,
		handAngles: resolveAngles(hourIndex, state, currentTime),
		brightness: determineBrightness(state),
		isAnimated: state === 'current',
		progress: determineProgress(state, currentTime)
	};
};

const createStateFromDate = (date: Date): DayState => {
	const currentHourIndex = date.getHours();
	return {
		currentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
		currentTime: date,
		currentHourIndex,
		elapsedHourCount: currentHourIndex,
		hours: Array.from({ length: 24 }, (_, hourIndex) =>
			buildHourClock(hourIndex, currentHourIndex, date)
		)
	};
};

export const createDayStateStore = () => {
	const { subscribe, set } = writable<DayState>(createStateFromDate(new Date()));
	let timer: ReturnType<typeof setTimeout> | null = null;

	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const scheduleTick = () => {
		clearTimer();
		const now = new Date();
		set(createStateFromDate(now));
		const millisUntilNextSecond = 1000 - now.getMilliseconds();
		timer = setTimeout(scheduleTick, millisUntilNextSecond);
	};

	return {
		subscribe,
		start() {
			if (timer) return;
			scheduleTick();
		},
		stop() {
			clearTimer();
		},
		refresh(date: Date = new Date()) {
			set(createStateFromDate(date));
		},
		updateCurrentTime(date: Date) {
			set(createStateFromDate(date));
		}
	};
};

export const dayState = createDayStateStore();
