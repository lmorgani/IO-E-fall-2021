/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0,
    diameter1 = 0,
    diameter2 = 0;

let osc1, osc2, osc3, fft;
var gif_loadImg, gif_createImg;
var soundFx;

function preload() {
    //    Gif from https://www.google.com/search?q=bird+silhouette+gif&rlz=1C1VDKB_enCA934CA934&sxsrf=AOaemvKN8qSOVMCF0TwjN6yChpTuF-6hTQ:1639725639068&tbm=isch&source=iu&ictx=1&fir=LGquL8MuEedRjM%252Ce9gQxjf8A89eLM%252C_%253B6yxAxWlzD5fMDM%252CgYn9VqQ438MGJM%252C_%253B7wOx7ZSs0dsamM%252CzLicPKqrfDaHGM%252C_%253BzSUJsU-uMJe6rM%252Cmx9XMlRr9a5s6M%252C_%253BiTQLreNITnEuoM%252CPDHeVj4u49A-mM%252C_%253BBPrW4MoeBawcqM%252CgYn9VqQ438MGJM%252C_%253Bm349TBU49FJGWM%252CzLicPKqrfDaHGM%252C_%253BP4ES4YVyAjurKM%252CxgdZjGs51Vog6M%252C_%253BaYC_rGX9yVl7iM%252CWizI7B4UrkEjlM%252C_%253BQjrUzhonfi_z_M%252CR4Qh1NwF0sRpkM%252C_%253BWYG8YJcuCC174M%252Ciemj_8y7ratKBM%252C_%253BFQhNUWN8xUz_aM%252Cj91f4wPmzLQebM%252C_&vet=1&usg=AI4_-kR8YQm-HY0ZuPIde4hInx0710NESQ&sa=X&sqi=2&ved=2ahUKEwjvhvuBpur0AhUOrHIEHW3zAQQQ9QF6BAgCEAE#imgrc=WYG8YJcuCC174M&imgdii=2cGr9FwQdjBZFM (best URL to provide, the site is private - https://aminoapps.com/c/virtual-space/page/blog/the-origin-of-man/w7Io_ul5XdNPEBroZK14XD77dmoaP)
    gif_loadImg = loadImage("img/birds1.gif");
    gif_createImg = createImg("img/birds1.gif");
    //    Start of citation https://stackoverflow.com/questions/43519812/array-of-sound-effects-in-p5-js
    //    All bird noises were retrieved from https://mixkit.co/free-sound-effects/bird/
    chirp1 = loadSound("sound/chirp1.wav");
    chirp2 = loadSound("sound/chirp2.wav");
    chirp3 = loadSound("sound/chirp3.wav");
    chirp4 = loadSound("sound/chirp4.wav");
    chirp5 = loadSound("sound/chirp5.wav");
    //    End of citation https://stackoverflow.com/questions/43519812/array-of-sound-effects-in-p5-js

}

function setup() {

    createCanvas(windowWidth, windowHeight);
    background(78, 20, 50, 25);
    soundFormats('wav');
    soundFx = [chirp1, chirp2, chirp3, chirp3, chirp4, chirp5];
    // For Pulsing ellipse


    ///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
    ///////////////////////////////////////////////////////////////////    


    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();
    console.log("serial.list()   ", serial.list());

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("COM3");
    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    // Here are the callbacks that you can register

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);
    // OR
    //serial.onList(gotList);

    // When we some data from the serial port
    serial.on('data', gotData);
    // OR
    //serial.onData(gotData);

    // When or if we get an error
    serial.on('error', gotError);
    // OR
    //serial.onError(gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);
    // OR
    //serial.onOpen(gotOpen);

    // Callback to get the raw data, as it comes in for handling yourself
    //serial.on('rawdata', gotRawData);
    // OR
    //serial.onRawData(gotRawData);


}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////


// We are connected and ready to go
function serverConnected() {
    console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    console.log("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        console.log(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
    console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    //    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log(currentString); // println the string
    latestData = currentString; // save it for the draw method
    //    console.log(latestData); //check to see if data is coming in
    //    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //    //console.log("splitter[0]" + splitter[0]); 
    //    diameter0 = splitter[0]; //put the first sensor's data into a variable
    //    diameter1 = splitter[1];
    //    diameter2 = splitter[2];



}

// We got raw data from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {

    // background(20);
    text(latestData, 10, 10);

    // Start of code from https://editor.p5js.org/ilay.skutelsky/sketches/Q0FRpE2kB7

    if (latestData <= 10) {
        // loads only first frame
        //        image(gif_loadImg, 50, 50);

        // updates animation frames by using an html
        // img element, positioning it over top of
        // the canvas.
        gif_createImg.position(0, 0);
        random(soundFx).play();
    } else {
        background(255);
        //        background(51, 25);
    }
    //console.log(freq3); 
}


function mouseClicked() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
        console.log("getAudioContext().state" + getAudioContext().state);
    }
};
