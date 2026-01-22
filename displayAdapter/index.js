import screenshot from 'screenshot-desktop'
import {Jimp} from "jimp";
import {intToRGBA} from '@jimp/utils'
import sharp from 'sharp';

const selectionWidth = 960
const selectionHeight = 540
const width = 3840
const mult = 1920 * 1080

const calcAvRGB = (buffer) => {
    const rgbAcc = {r: 0, g: 0, b: 0};
    for (let i = 0; i < selectionWidth - 1; i++) {
        for (let j = 0; j < selectionHeight - 1; j++) {
            rgbAcc['r'] = rgbAcc['r'] + buffer[(j * width + i) * 3];
            rgbAcc['g'] = rgbAcc['g']  + buffer[(j * width + i) * 3 + 1];
            rgbAcc['b'] = rgbAcc['b'] + buffer[(j * width + i) * 3 + 2];
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
    const {data, info} = await sharp(imgBuffer).raw().toBuffer({resolveWithObject: true});
    const avRgb = calcAvRGB(data)
    const finalColor = scaleRbgToFull(avRgb);
    return finalColor
}

