import {getAvColor} from "./displayAdapter/index.js";
import {getDevice} from "./ledStripAdapter/index.js";

const device = await getDevice();

setInterval(async () => {
    getAvColor().then(color => device.setColour(...color))
}, 50)

