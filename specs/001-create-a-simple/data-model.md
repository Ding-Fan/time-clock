# Data Model — 24-Hour Visual Time Clock

## Entities

### DayState

- **currentDate** (Date): Local date derived from the user's system clock; updates at midnight rollover.
- **currentTime** (Date): Timestamp of the latest tick (precision to seconds); used to drive the active clock.
- **currentHourIndex** (number, range 0-23): Hour slot currently in progress; recalculated whenever `currentTime` changes hour.
- **elapsedHourCount** (number, range 0-24): Derived count of fully elapsed hours used for quick statistics (e.g., success criteria SC-002).
- **hours** (HourClock[24]): Ordered list of hour descriptors for rendering.
- **Status/Validation**: `currentHourIndex` must match `Math.floor(currentTime hours)`; `hours.length` must equal 24.

### HourClock

- **hourIndex** (number, range 0-23): Position in the day; primary key within the collection.
- **label** (string, format `HH:00`): Display label rendered under the clock; zero-padded.
- **state** (enum `"past" | "current" | "future"`): Visual state derived from comparing `hourIndex` with `currentHourIndex`.
- **handAngles** (ClockHandAngles): Precomputed degrees for hour/minute/second hands.
- **brightness** (enum `"dim" | "normal"`): Styling hint translating to CSS classes (FR-006/FR-007).
- **isAnimated** (boolean): Indicates if the clock should receive live updates (only the current hour).
- **Status/Validation**: When `state === "past"`, `handAngles.hour` must equal `(hourIndex + 1) * 30`; when `state === "future"`, all hand angles must equal 0 (12 o'clock).

### ClockHandAngles

- **hour** (number, degrees 0-360): Angle for hour hand; past/future clocks freeze, current clock updates continuously.
- **minute** (number, degrees 0-360): Angle for minute hand.
- **second** (number, degrees 0-360): Angle for second hand; only used on current clock, optional for past/future.
- **Status/Validation**: Values must stay within [0, 360). For current hour, recomputed every tick based on `currentTime`.

## Relationships & Derived Logic

- `DayState` owns 24 `HourClock` instances ordered by `hourIndex` (0 → 23).
- `state` for each `HourClock` is derived via comparison of `hourIndex` with `currentHourIndex`.
- `handAngles` for past hours depend on `hourIndex + 1`, ensuring frozen clocks per FR-015.
- `handAngles` for future hours are constant zeroed values per FR-016.
- The current hour's `handAngles` are recomputed on each second tick, satisfying FR-017 through FR-019.

## State Transitions

1. **Initial Load**
   - Compute `currentTime` from `Date.now()`.
   - Set `currentHourIndex` and populate `hours` with derived states and angles.

2. **Per-Second Tick (Current Hour Animation)**
   - Update `currentTime` each second via `setInterval` or `requestAnimationFrame` + delta check.
   - Recompute `handAngles` for `state === "current"` only; other clocks remain static.

3. **Hour Rollover**
   - Detect when `Math.floor(previousHour)` differs from `Math.floor(currentTime hour)`.
   - Update `currentHourIndex`.
   - Reclassify each `HourClock` state/brightness and recompute `handAngles` for the new current hour and the hour that just became past.

4. **Midnight Reset**
   - When date changes, reset `currentDate`, `elapsedHourCount`, and regenerate all `HourClock` entries to reflect the new day.
