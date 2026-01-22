import TuyAPI from 'tuyapi';
import rgb from 'rgb-hsv';
import fs from 'fs';


// Codes: 20, 21, 24
// 20 - on/off boolean
// 21 - mode white/colour
// 24 color - hsv-hex

const raw = fs.readFileSync('./ledStripAdapter/secrets.json', 'utf8');
const secrets = JSON.parse(raw);

const device = new TuyAPI({
    ...secrets,
    version: 3.3
});

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


device.on('error', err => {
    console.log('Device error:', err);
});

device.on('data', data => {
    console.log('Data from device:', data);
});

device.setWithoutWaiting = async function(args){
    await this.set({...args, shouldWaitForResponse: false});
}

device.turnOn = function(){
    device.setWithoutWaiting({dps:20, set: true});
}

device.turnOff = function(){
    device.setWithoutWaiting({dps:20, set: false});
}

device.setWhiteMode = function (){
    device.setWithoutWaiting({dps:21, set: 'white'});
}

device.setColourMode = function (){
    device.setWithoutWaiting({dps:21, set: 'colour'});
}

device.setColour = function (r, g, b){
    device.setWithoutWaiting({dps:24, set: rgbToDps(r, g, b)});
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

export async function getDevice(){
    await device.find();
    await device.connect();
    return device;
}
