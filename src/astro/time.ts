/**
 * How many minutes the given time zone is ahead of UTC at a given instant.
 * Uses the browser's built-in IANA time zone database (Intl), so historical
 * rules such as Taiwan's 1945–1979 daylight saving time are handled for us.
 */
function zoneOffsetMinutes(utcMs: number, timeZone: string): number {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const parts: Record<string, number> = {};
    for (const part of formatter.formatToParts(new Date(utcMs))) {
        if (part.type !== "literal") parts[part.type] = Number(part.value);
    }
    const wallClockAsUtc = Date.UTC(
        parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second,
    );
    return (wallClockAsUtc - utcMs) / 60_000;
}

/** Converts a local birth date and time in an IANA time zone to a UTC Date. */
export function toUtcDate(date: string, time: string, timeZone: string): Date {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);

    // The offset depends on the instant itself, so refine once more
    // in case the first guess lands on the other side of a DST change.
    let utcMs = localAsUtc - zoneOffsetMinutes(localAsUtc, timeZone) * 60_000;
    utcMs = localAsUtc - zoneOffsetMinutes(utcMs, timeZone) * 60_000;
    return new Date(utcMs);
}
