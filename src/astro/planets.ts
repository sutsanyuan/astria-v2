import { Body, Ecliptic, EclipticGeoMoon, GeoVector } from "astronomy-engine";
import type { Planet } from "./types.ts";

export const PLANETS: readonly Planet[] = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
];

const BODIES: Record<Planet, Body> = {
    Sun: Body.Sun,
    Moon: Body.Moon,
    Mercury: Body.Mercury,
    Venus: Body.Venus,
    Mars: Body.Mars,
    Jupiter: Body.Jupiter,
    Saturn: Body.Saturn,
    Uranus: Body.Uranus,
    Neptune: Body.Neptune,
    Pluto: Body.Pluto,
};

/** Geocentric ecliptic longitude (true ecliptic of date), degrees. */
export function eclipticLongitude(planet: Planet, date: Date): number {
    if (planet === "Moon") return EclipticGeoMoon(date).lon;
    return Ecliptic(GeoVector(BODIES[planet], date, true)).elon;
}

/** A planet is retrograde when its longitude is decreasing as seen from Earth. */
export function isRetrograde(planet: Planet, date: Date): boolean {
    if (planet === "Sun" || planet === "Moon") return false;
    const halfDay = 12 * 60 * 60 * 1000;
    const before = eclipticLongitude(planet, new Date(date.getTime() - halfDay));
    const after = eclipticLongitude(planet, new Date(date.getTime() + halfDay));
    const change = ((after - before + 540) % 360) - 180; // signed, handles 359° → 1°
    return change < 0;
}
