'strict';
//Simple web api for the garage
//http://wiringpi.com/the-gpio-utility
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let exec = require('child_process').exec;
const util = require('util');
const aexec = util.promisify(require('child_process').exec);
let router = express.Router();

let lightGpioPin = 15;
let garageDoorGpioPin = 14;
let garageDoorStatusGpioPin = 18;
let port = 8090;

let log = (data) => { console.log(data); }
let gpioExport = (pin, direction) => exec(`gpio export ${pin} ${direction}`, null);
let gpioUnexport = (pin) => exec(`gpio unexport ${pin}`, null);
let gpioWrite = (pin, value) => exec(`gpio write ${pin} ${value}`);

async function gpioRead(pin) {
    const { stdout, stderr } = await aexec(`python gpioStatus.py ${pin}`);
    return stdout;
}

/**
 * Simulate a button press by exporting a pin then unexporting it.  Default value is to trigger then relay on which is annoyning. 
 * @param {*} pin 
 */
let relayButtonPressAction = (pin) => {
    gpioExport(pin, 'out');
    gpioWrite(pin, 1);
    setTimeout(() => {
        gpioWrite(pin, 0);
        gpioUnexport(pin);
    }, 500);
}

gpioExport(garageDoorStatusGpioPin, 'in');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.json({ message: 'ok' });
    log('ok');
});

router.get('/garage/status', function (req, res) {
    gpioRead(garageDoorStatusGpioPin).then(data => {
        res.json({ message: data.trim() });
        log(data.trim());
    });
});

router.get('/garage/toggle', function (req, res) {
    relayButtonPressAction(garageDoorGpioPin);
    let msg = "garage toggled";
    res.json({ message: msg });
    log(msg);
});

router.get('/light/toggle', function (req, res) {
    relayButtonPressAction(lightGpioPin);
    let msg = "light toggled";
    res.json({ message: msg });
    log(msg);
});

router.get('/exit', function (req, res) {
    try {
        gpioUnexport(lightGpioPin);
    } catch (error) {

    }
    res.json({ message: 'exited' });
    //kill it
    setTimeout(() => process.exit(), 2000);
});

app.use('/api', router); // all of our routes will be prefixed with /api
app.listen(port, () => {
    log(`listening on ${port}.`);
});