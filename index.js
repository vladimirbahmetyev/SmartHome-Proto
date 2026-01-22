import {getAvColor} from "./displayAdapter/index.js";
import {getDevice} from "./ledStripAdapter/index.js";

const device = await getDevice();

setInterval(async () => {
    getAvColor().then(color => {
        const avColor = Math.round((color[0] + color[1] + color[2])/3);
        const delta = Math.max(avColor - color[0], avColor - color[1], avColor - color[2]);
        if(delta < 10){
            device.setWhiteMode()
        } else {
            device.setColourMode()
            device.setColour(...color)
        }
    })
}, 500)

