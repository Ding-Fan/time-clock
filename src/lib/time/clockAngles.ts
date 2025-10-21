export type ClockHandAngles = {
	hour: number;
	minute: number;
	second: number;
};

const HOURS_IN_CLOCK = 12;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const DEGREES_IN_CIRCLE = 360;
const DEGREES_PER_HOUR = DEGREES_IN_CIRCLE / HOURS_IN_CLOCK;
const DEGREES_PER_MINUTE = DEGREES_IN_CIRCLE / MINUTES_IN_HOUR;
const DEGREES_PER_SECOND = DEGREES_IN_CIRCLE / SECONDS_IN_MINUTE;

const normalize = (degrees: number): number => {
	const wrapped = degrees % DEGREES_IN_CIRCLE;
	return wrapped < 0 ? wrapped + DEGREES_IN_CIRCLE : wrapped;
};

export const calculateFutureAngles = (): ClockHandAngles => {
	return {
		hour: 0,
		minute: 0,
		second: 0
	};
};

export const calculatePastAngles = (hourIndex: number): ClockHandAngles => {
	const hourOnClock = (hourIndex + 1) % HOURS_IN_CLOCK;
	return {
		hour: normalize(hourOnClock * DEGREES_PER_HOUR),
		minute: 0,
		second: 0
	};
};

export const calculateCurrentAngles = (date: Date): ClockHandAngles => {
	const hours = date.getHours() % HOURS_IN_CLOCK;
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	// Use cumulative rotation to prevent flicker at 0 seconds
	// Instead of resetting to 0°, keep incrementing throughout the day
	const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;
	const totalMinutesToday = hours * 60 + minutes;

	return {
		hour:
			(hours + minutes / MINUTES_IN_HOUR + seconds / (MINUTES_IN_HOUR * SECONDS_IN_MINUTE)) *
			DEGREES_PER_HOUR,
		minute:
			totalMinutesToday * DEGREES_PER_MINUTE + (seconds / SECONDS_IN_MINUTE) * DEGREES_PER_MINUTE,
		second: totalSecondsToday * DEGREES_PER_SECOND
	};
};

export type ClockState = 'past' | 'current' | 'future';

export const resolveAngles = (
	hourIndex: number,
	state: ClockState,
	currentTime: Date
): ClockHandAngles => {
	if (state === 'future') {
		return calculateFutureAngles();
	}
	if (state === 'past') {
		return calculatePastAngles(hourIndex);
	}
	return calculateCurrentAngles(currentTime);
};
