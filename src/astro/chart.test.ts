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
});