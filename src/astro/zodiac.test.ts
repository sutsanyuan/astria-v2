import { describe, it, expect } from "vitest";
import { toSignPosition } from "./zodiac.ts";

describe("toSignPosition", () => {
  it("182 度是天秤座第 2 度", () => {
    expect(toSignPosition(182)).toEqual({ sign: "Libra", degreeInSign: 2 });
  });

  it("5 度是牡羊座第 5 度", () => {
    expect(toSignPosition(5)).toEqual({ sign: "Aries", degreeInSign: 5 });
  });
});