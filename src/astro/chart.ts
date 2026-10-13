import type { BirthData, ChartResult, HouseSystem } from "./types.ts";
import { computeAngles, computeHouseCusps, houseOf } from "./houses.ts";
import { PLANETS, eclipticLongitude, isRetrograde } from "./planets.ts";
import { toUtcDate } from "./time.ts";
import { toSignPosition } from "./zodiac.ts";

/** Computes a full natal chart from birth data. */
export function computeChart(birth: BirthData, houseSystem: HouseSystem = "placidus"): ChartResult {
    const date = toUtcDate(birth.date, birth.time, birth.timeZone);
    const angles = computeAngles(date, birth.latitude, birth.longitude);
    const houseCusps = computeHouseCusps(houseSystem, angles, birth.latitude);

    const planets = PLANETS.map((planet) => {
        const longitude = eclipticLongitude(planet, date);
        return {
            planet,
            longitude,
            ...toSignPosition(longitude),
            house: houseOf(longitude, houseCusps),
            retrograde: isRetrograde(planet, date),
        };
    });

    return { ascendant: angles.ascendant, midheaven: angles.midheaven, houseCusps, planets };
}
