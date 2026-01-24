import TuyAPI from 'tuyapi';
import rgb from 'rgb-hsv';
import fs from 'fs';


// Codes: 20, 21, 24
// 20 - on/off boolean
// 21 - mode white/colour
// 24 color - hsv-hex

const raw = fs.readFileSync('./ledStripAdapter/secrets.json', 'utf8');
const secrets = JSON.parse(raw); //Array of secrets

const devices = secrets.map(secret => new TuyAPI({...secret, version: 3.3}))
const deviceController = {}

function hsvToTuyaDPS24(h, s, v) {
    const hue = h;
    const sat = s * 10;
    const bright = Math.round(v) * 10; // уже 0-1000

    const hueHex = hue.toString(16).padStart(4, '0');
    const satHex = sat.toString(16).padStart(4, '0');
    const brightHex = bright.toString(16).padStart(4, '0');

    return hueHex + satHex + brightHex;
}

function rgbToDps (r, g, b) {
    return hsvToTuyaDPS24(...rgb(r, g, b));
}


// devices.forEach(device => {
//     device.on('error', err => {
//         console.log('Device error:', err);
//     });
//
//     device.on('data', data => {
//         console.log('Data from device:', data);
//     });
// })

deviceController.setWithoutWaiting = async function(args){
    devices.forEach(device => {
        device.set({...args, shouldWaitForResponse: false});
    })

}

deviceController.turnOn = function(){
    deviceController.setWithoutWaiting({dps:20, set: true});
}

deviceController.turnOff = function(){
    deviceController.setWithoutWaiting({dps:20, set: false});
}

deviceController.setWhiteMode = function (){
    deviceController.setWithoutWaiting({dps:21, set: 'white'});
}

deviceController.setWhiteBrightness = function (brightness= 1000) {
    deviceController.setWithoutWaiting({dps:22, set: brightness});
}

deviceController.setColourMode = function (){
    deviceController.setWithoutWaiting({dps:21, set: 'colour'});
}

deviceController.setColour = function (r, g, b){
    deviceController.setWithoutWaiting({dps:24, set: rgbToDps(r, g, b)});
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

export async function getDevice(){
    await Promise.all(devices.map(device => device.find()));
    await Promise.all(devices.map(device => device.connect()));
    return deviceController;
}
