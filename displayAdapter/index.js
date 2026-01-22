import screenshot from 'screenshot-desktop'
import {Jimp} from "jimp";
import {intToRGBA} from '@jimp/utils'


const selectionWidth = 960
const selectionHeight = 540
const mult = 1920 * 1080

const calcAvRGB = (img) => {
    const rgbAcc = {r: 0, g: 0, b: 0};
    for (let i = 0; i < selectionWidth - 1; i++) {
        for (let j = 0; j < selectionHeight - 1; j++) {
            let pixel = intToRGBA(img.getPixelColor(i * 4, j * 4))
            rgbAcc['r'] = rgbAcc['r'] + pixel['r'];
            rgbAcc['g'] = rgbAcc['g']  + pixel['g'];
            rgbAcc['b'] = rgbAcc['b'] + pixel['b'];
        }
    }
    rgbAcc['r'] = Math.round(rgbAcc['r'] / mult);
    rgbAcc['g'] = Math.round(rgbAcc['g'] / mult);
    rgbAcc['b'] = Math.round(rgbAcc['b'] / mult);
    return rgbAcc;
}

const scaleRbgToFull = (avRgb) => {
    const result = []
    const maxVal = Math.max(avRgb['r'],avRgb['g'],avRgb['b'] )
    result.push(Math.round(avRgb['r']/maxVal * 255));
    result.push(Math.round(avRgb['g']/maxVal * 255));
    result.push(Math.round(avRgb['b']/maxVal * 255));
    return result
}

export async function getAvColor() {
    const imgBuffer = await screenshot({screen: 0});
    const img = await Jimp.read(imgBuffer);

    const avRgb = calcAvRGB(img)
    const finalColor = scaleRbgToFull(avRgb);
    return finalColor
}
