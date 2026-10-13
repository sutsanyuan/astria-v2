import type { ZodiacSign } from "./types.ts";

export const ZODIAC_SIGNS: readonly ZodiacSign[] = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

/** Wraps any angle into the range [0, 360). */
export function normalizeDegrees(degrees: number): number {
    return ((degrees % 360) + 360) % 360;
}

/** Splits an ecliptic longitude into its sign and the degree within that sign. */
export function toSignPosition(longitude: number): { sign: ZodiacSign; degreeInSign: number } {
    const lon = normalizeDegrees(longitude);
    const index = Math.floor(lon / 30);
    return { sign: ZODIAC_SIGNS[index], degreeInSign: lon - index * 30 };
}
