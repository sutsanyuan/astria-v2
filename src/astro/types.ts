// 十二星座（英文名稱，顯示中文時再另外對照）
export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

// 行星：太陽、月亮、水星到冥王星，共 10 個
export type Planet = |"Sun"|"Moon"|"Mercury"|"Venus"|"Mars"|"Jupiter"|"Saturn"|"Uranus"|"Neptune"|"Pluto";

// 宮位制
export type HouseSystem = "placidus" | "porphyry" | "whole-sign";

// 使用者輸入的出生資料
export type BirthData = {
  date: string;        // "1995-07-07"
  time: string;        // "11:08"
  timeZone: string;    // IANA 時區名稱，例如 "Asia/Taipei"
  latitude: number;    // 北緯為正，例如 25.0167
  longitude: number;   // 東經為正，例如 121.55
};

// 一顆行星在星盤上的位置
export type PlanetPosition = {
  planet: Planet;
  longitude: number;     // 黃道經度 0～360，例如 104.57
  sign: ZodiacSign;
  degreeInSign: number;  // 在該星座內的度數 0～30，例如 14.57
  house: number;         // 第幾宮 1～12
  retrograde: boolean;       // 是否逆行
};

// 計算完成的整張星盤
export type ChartResult = {
  ascendant: number;     // 上升點的黃道經度
  midheaven: number;     // 天頂的黃道經度
  houseCusps: number[];       // 12 個宮頭的黃道經度
  planets: PlanetPosition[];          // 10 顆行星的位置
};