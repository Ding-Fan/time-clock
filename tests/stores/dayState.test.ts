import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDayStateStore } from '$lib/stores/dayState';

const sampleDate = (hour: number, minute = 15, second = 30) =>
	new Date(2025, 2, 1, hour, minute, second);

const snapshot = <T>(store: { subscribe: (run: (value: T) => void) => () => void }): T => {
	let value: T | undefined;
	const unsubscribe = store.subscribe((state) => {
		value = state;
	});
	unsubscribe();
	return value as T;
};

describe('dayState store', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('initializes with 24 hours and correct segmentation', () => {
		const date = sampleDate(10);
		vi.setSystemTime(date);
		const store = createDayStateStore();
		const state = snapshot(store);

		expect(state.hours).toHaveLength(24);
		expect(state.currentHourIndex).toBe(10);
		expect(state.elapsedHourCount).toBe(10);
		expect(state.hours[10].state).toBe('current');
		expect(state.hours[10].progress).toBeGreaterThan(0);
		expect(state.hours[10].progress).toBeLessThan(1);
		expect(state.hours.slice(0, 10).every((hour) => hour.state === 'past')).toBe(true);
		expect(state.hours.slice(11).every((hour) => hour.state === 'future')).toBe(true);
	});

	it('freezes past hours at end of hour and future hours at noon', () => {
		const date = sampleDate(10);
		vi.setSystemTime(date);
		const store = createDayStateStore();
		const state = snapshot(store);

		const past = state.hours[9];
		expect(past.state).toBe('past');
		expect(past.handAngles).toEqual({ hour: 300, minute: 0, second: 0 });
		expect(past.progress).toBe(1);

		const future = state.hours[11];
		expect(future.state).toBe('future');
		expect(future.handAngles).toEqual({ hour: 0, minute: 0, second: 0 });
		expect(future.progress).toBe(0);
	});

	it('ticks once per second when started', () => {
		const start = sampleDate(10, 15, 0);
		vi.setSystemTime(start);
		const store = createDayStateStore();
		const seconds: number[] = [];

		const unsubscribe = store.subscribe((state) => {
			seconds.push(state.currentTime.getSeconds());
		});

		store.start();
		vi.advanceTimersByTime(3200);
		store.stop();
		unsubscribe();

		const deduped = seconds.filter((value, index) => index === 0 || value !== seconds[index - 1]);
		const initial = deduped[0];
		expect(deduped.slice(0, 4)).toEqual([
			initial,
			(initial + 1) % 60,
			(initial + 2) % 60,
			(initial + 3) % 60
		]);
	});
});
