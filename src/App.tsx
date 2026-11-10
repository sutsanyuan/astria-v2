import ChartWheel from "./components/ChartWheel";
import { computeChart } from "./astro/chart";

function App() {
    const chart = computeChart({
        date: "1995-07-07",
        time: "11:08",
        timeZone: "Asia/Taipei",
        latitude: 25.033,
        longitude: 121.5654,
    });

    return <ChartWheel chart={chart} />;
}

export default App;
