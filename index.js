import {getAvColor} from "./displayAdapter/index.js";
import {getDevice} from "./ledStripAdapter/index.js";

const device = await getDevice();

setInterval(async () => {
    const start = process.hrtime()
    const color = await getAvColor()
    const diff = process.hrtime(start);
    console.log(`Время рассчета цвета - ${diff[0]}s и ${diff[1] / 1e6}ms`);
    device.setColour(...color)
}, 300)

