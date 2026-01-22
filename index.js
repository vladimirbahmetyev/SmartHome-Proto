import {getAvColor} from "./displayAdapter/index.js";
import {getDevice} from "./ledStripAdapter/index.js";
import rgb from "rgb-hsv";

const device = await getDevice();

setInterval(async () => {
    device.turnOn()
    getAvColor().then(color => {
        const saturation = rgb(...color)[1]
        const brightness = rgb(...color)[2];
        if(saturation < 15){
            device.setWhiteMode()
            device.setWhiteBrightness(brightness * 10)
        } else {
            device.setColourMode()
            device.setColour(...color)
        }
    })
}, 100)

