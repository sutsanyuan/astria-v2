import { ZODIAC_SIGNS } from "../astro/zodiac";
import type { ZodiacSign } from "../astro/types";
const SIZE = 600;
const CENTER = SIZE / 2;
const OUTER_R = 280; // 星座環外圈
const INNER_R = 230; // 星座環內圈

// \uFE0E 讓符號顯示成文字，不會變成彩色 emoji
const SIGN_SYMBOLS: Record<ZodiacSign, string> = {
    Aries: "♈\uFE0E",
    Taurus: "♉\uFE0E",
    Gemini: "♊\uFE0E",
    Cancer: "♋\uFE0E",
    Leo: "♌\uFE0E",
    Virgo: "♍\uFE0E",
    Libra: "♎\uFE0E",
    Scorpio: "♏\uFE0E",
    Sagittarius: "♐\uFE0E",
    Capricorn: "♑\uFE0E",
    Aquarius: "♒\uFE0E",
    Pisces: "♓\uFE0E",
};
// 給半徑和角度，算出圓上那一點的 (x, y)
function polarToXY(radius: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180; // 角度 → 弧度
    return {
        x: CENTER - radius * Math.cos(rad), // 減號：0° 在左邊
        y: CENTER + radius * Math.sin(rad), // 加號：SVG 的 y 往下，這樣才是逆時針
    };
}

export default function ChartWheel() {
    return (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={500} height={500}>
            <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" stroke="white" />
            <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="none" stroke="white" />
            {ZODIAC_SIGNS.map((sign, i) => {
                const angle = i * 30;
                const start = polarToXY(INNER_R, angle);
                const end = polarToXY(OUTER_R, angle);
                const label = polarToXY((OUTER_R + INNER_R) / 2, angle + 15); // 格子中間
                return (
                    <g key={sign}>
                        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="white" />
                        <text
                            x={label.x}
                            y={label.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize={22}>
                            {SIGN_SYMBOLS[sign]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
