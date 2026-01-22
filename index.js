import {getAvColor} from "./displayAdapter/index.js";
import {getDevice} from "./ledStripAdapter/index.js";
import rgb from "rgb-hsv";

const device = await getDevice();

setInterval(async () => {
    device.turnOn()
    getAvColor().then(color => {
        const avColor = Math.round((color[0] + color[1] + color[2])/3);
        const saturation = rgb(...color)[1]
        if(saturation < 15){
            device.setWhiteMode()
            device.setWhiteBrightness(Math.round(avColor/255 * 1000))
        } else {
            device.setColourMode()
            device.setColour(...color)
        }
    })
}, 100)

