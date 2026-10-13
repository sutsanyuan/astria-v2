import { describe, expect, it } from "vitest";
import { computeChart } from "./chart.ts";

// 把「度°分'秒"」換算成小數的度數
function dms(degrees: number, minutes: number, seconds: number): number {
  return degrees + minutes / 60 + seconds / 3600;
}

const chart = computeChart({
  date: "1995-07-07",
  time: "11:08",
  timeZone: "Asia/Taipei",
  latitude: 25.0330,
  longitude: 121.5654,
});

describe("我的星盤", () => {
  it("上升點在天秤座 2°53'23\"", () => {
    expect(chart.ascendant).toBeCloseTo(180 + dms(2, 53, 23), 2);
  });
  it("天頂在巨蟹座 2°55'33\"", () => {
    // 巨蟹座是第 4 個星座，前面有 3 個星座
    expect(chart.midheaven).toBeCloseTo(90 + dms(2, 55, 33), 2);
  });

  it("太陽在巨蟹座第 10 宮", () => {
    const sun = chart.planets.find((p) => p.planet === "Sun");
    expect(sun?.sign).toBe("Cancer");
    expect(sun?.house).toBe(10);
  });

  it("木星逆行", () => {
    const jupiter = chart.planets.find((p) => p.planet === "Jupiter");
    expect(jupiter?.retrograde).toBe(true);
  });
});