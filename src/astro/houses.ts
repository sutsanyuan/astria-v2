import { MakeTime, SiderealTime, e_tilt } from "astronomy-engine";
import type { HouseSystem } from "./types.ts";
import { normalizeDegrees } from "./zodiac.ts";

const RAD = Math.PI / 180;

export type ChartAngles = {
    ascendant: number; // ecliptic longitude, degrees
    midheaven: number; // ecliptic longitude, degrees
    ramc: number; // right ascension of the midheaven (local sidereal time), degrees
    obliquity: number; // true obliquity of the ecliptic, degrees
};

/** Ascendant and midheaven for a moment and place on Earth. */
export function computeAngles(date: Date, latitude: number, longitude: number): ChartAngles {
    const ramc = normalizeDegrees(SiderealTime(date) * 15 + longitude);
    const obliquity = e_tilt(MakeTime(date)).tobl;
    const r = ramc * RAD;
    const e = obliquity * RAD;
    const phi = latitude * RAD;

    const midheaven = normalizeDegrees(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(e)) / RAD);
    const ascendant = normalizeDegrees(
        Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / RAD,
    );
    return { ascendant, midheaven, ramc, obliquity };
}

/** Forward distance from `from` to `to`, going counter-clockwise around the zodiac. */
function arc(from: number, to: number): number {
    return normalizeDegrees(to - from);
}

/** Builds all 12 cusps from houses 1, 2, 3, 10, 11 and 12 (the rest are opposite points). */
function withOpposites(c: { 1: number; 2: number; 3: number; 10: number; 11: number; 12: number }): number[] {
    const cusps = [c[1], c[2], c[3], 0, 0, 0, 0, 0, 0, c[10], c[11], c[12]];
    for (let i = 3; i < 9; i++) cusps[i] = normalizeDegrees(cusps[(i + 6) % 12] + 180);
    return cusps;
}

function porphyry({ ascendant, midheaven }: ChartAngles): number[] {
    const ic = normalizeDegrees(midheaven + 180);
    const upper = arc(midheaven, ascendant) / 3; // houses 10–12
    const lower = arc(ascendant, ic) / 3; // houses 1–3
    return withOpposites({
        1: ascendant,
        2: normalizeDegrees(ascendant + lower),
        3: normalizeDegrees(ascendant + 2 * lower),
        10: midheaven,
        11: normalizeDegrees(midheaven + upper),
        12: normalizeDegrees(midheaven + 2 * upper),
    });
}

function wholeSign({ ascendant }: ChartAngles): number[] {
    const first = Math.floor(ascendant / 30) * 30;
    return Array.from({ length: 12 }, (_, i) => normalizeDegrees(first + i * 30));
}

/**
 * Placidus: each intermediate cusp is the point whose diurnal (or nocturnal)
 * semi-arc has been divided into thirds. Solved by fixed-point iteration.
 */
function placidusCusp(angles: ChartAngles, latitude: number, fraction: number, aboveHorizon: boolean): number {
    const e = angles.obliquity * RAD;
    const phi = latitude * RAD;
    const ramc = angles.ramc * RAD;
    let lambda = angles.midheaven * RAD;

    for (let i = 0; i < 50; i++) {
        const declination = Math.asin(Math.sin(e) * Math.sin(lambda));
        const x = Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(declination)));
        const diurnalSemiArc = Math.acos(x);
        const ra = aboveHorizon
            ? ramc + fraction * diurnalSemiArc
            : ramc + Math.PI - fraction * (Math.PI - diurnalSemiArc);
        const next = Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(e));
        if (Math.abs(next - lambda) < 1e-10) break;
        lambda = next;
    }
    return normalizeDegrees(lambda / RAD);
}

function placidus(angles: ChartAngles, latitude: number): number[] {
    return withOpposites({
        1: angles.ascendant,
        2: placidusCusp(angles, latitude, 2 / 3, false),
        3: placidusCusp(angles, latitude, 1 / 3, false),
        10: angles.midheaven,
        11: placidusCusp(angles, latitude, 1 / 3, true),
        12: placidusCusp(angles, latitude, 2 / 3, true),
    });
}

/**
 * House cusps as ecliptic longitudes; index 0 is the 1st house.
 * Placidus is undefined inside the polar circles, so it falls back to Porphyry there.
 */
export function computeHouseCusps(system: HouseSystem, angles: ChartAngles, latitude: number): number[] {
    if (system === "whole-sign") return wholeSign(angles);
    if (system === "porphyry" || Math.abs(latitude) >= 66) return porphyry(angles);
    return placidus(angles, latitude);
}

/** Which house (1–12) an ecliptic longitude falls in. */
export function houseOf(longitude: number, cusps: number[]): number {
    for (let i = 0; i < 12; i++) {
        const start = cusps[i];
        const end = cusps[(i + 1) % 12];
        if (arc(start, longitude) < arc(start, end)) return i + 1;
    }
    return 12;
}
