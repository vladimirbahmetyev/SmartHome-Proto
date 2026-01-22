
import robot from "robotjs";
import sharp from 'sharp';
import {DesktopDuplication} from 'windows-desktop-duplication';

const selectionWidth = 3840
const selectionHeight = 2160
const decreaser = 4
const mult = 3840 * 2160 / (decreaser ** 2)
let dd = new DesktopDuplication(0); // экран 0
dd.initialize();

const calcAvRGB = (buffer) => {
    const rgbAcc = {r: 0, g: 0, b: 0};
    for (let i = 0; i < selectionWidth - 1; i+=decreaser) {
        for (let j = 0; j < selectionHeight - 1; j+=decreaser) {
            rgbAcc['r'] = rgbAcc['r'] + buffer[(j * selectionWidth + i) * 3 + 2];
            rgbAcc['g'] = rgbAcc['g']  + buffer[(j * selectionWidth + i) * 3 + 1];
            rgbAcc['b'] = rgbAcc['b'] + buffer[(j * selectionWidth + i) * 3];
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
    const scaleFactor = Math.min(255 / maxVal , 5)
    result.push(Math.min(255, Math.round(avRgb['r'] * scaleFactor)));
    result.push(Math.min(255,Math.round(avRgb['g'] * scaleFactor)));
    result.push(Math.min(255,Math.round(avRgb['b'] * scaleFactor)));
    return result
}

export async function getAvColor() {
    const { image } = robot.screen.capture(0, 0, 3840, 2160);
    const {data, info} = await sharp(image, {raw:{width:3840, height:2160, channels: 4}})
        .removeAlpha()
        .raw()
        .toBuffer({resolveWithObject: true});
    const avRgb = calcAvRGB(data)
    const finalColor = scaleRbgToFull(avRgb);
    return finalColor;
}

