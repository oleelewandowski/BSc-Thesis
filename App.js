const SAMPLING_FREQUENCY = 44100;
const SOUND_DURATION = 1; //sound 1s draw 10ms
const BETA = 5;

//CARRIER VARIABLES
let CARRIER_REAL_TIME_FREQUENCY = 2000;
let CARRIER_AMPLITUDE = 0.5;
let CARRIER_ANGULAR_FREQUENCY = CARRIER_REAL_TIME_FREQUENCY * 2 * Math.PI;

//MESSAGE VARIABLES
let MESSAGE_REAL_TIME_FREQUENCY = 200;
let MESSAGE_AMPLITUDE = 0.5;
let MESSAGE_ANGULAR_FREQUENCY = MESSAGE_REAL_TIME_FREQUENCY * 2 * Math.PI;

// CONSTS
const CARRIER_AMPLITUDE_MAX = 1; //max for plot
const MESSAGE_AMPLITUDE_MAX = 1; //max for plot
const MODULATED_AMPLITUDE_MAX = 1; //max for plot

//CARRIER
const playCarrierSignal = () => {
  const ALL_SAMPLES = SOUND_DURATION * SAMPLING_FREQUENCY;
  const CHANNEL_TYPE = 1; //1-mono, 2-stereo
  const PREV_CARRIER_AMPITUDE = CARRIER_AMPLITUDE;

  let audioContext = new AudioContext();

  //CHANNEL_TYPE - mono channel <--> ALL_SAMPLES - samples the buffer should hold <--> SAMPLING_FREQUENCY - sample rate of the buffer
  let buffer = audioContext.createBuffer(
    CHANNEL_TYPE,
    ALL_SAMPLES,
    SAMPLING_FREQUENCY
  );

  let data = buffer.getChannelData(0);

  function generateSample(sample) {
    let time = sample / SAMPLING_FREQUENCY;
    let angle = time * CARRIER_ANGULAR_FREQUENCY;

    return CARRIER_AMPLITUDE * Math.sin(angle);
  }

  for (let sample = 0; sample < ALL_SAMPLES; sample++) {
    data[sample] = generateSample(sample);
  }

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();

  if (PREV_CARRIER_AMPITUDE != CARRIER_AMPLITUDE) {
    source.disconnect(audioContext.destination);
  }
};
const drawCarrierSignal = () => {
  // define canvas
  let canvas = document.querySelector("#my-carrier-canvas");
  if (null === canvas || !canvas.getContext) return 0;

  let carrierDuration = SOUND_DURATION / 100;
  // axes center coordinates
  let axes = {};

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  axes.x0 = 0.5 * canvas.width;
  axes.y0 = 0.5 * canvas.height;

  showAxes(ctx, axes);

  let time = [];
  let carrierData = [];

  // define plot paramaters
  let tstart = -carrierDuration;
  let tstop = carrierDuration; //10ms *2
  let dt = (tstop - tstart) / SAMPLING_FREQUENCY; // time increment

  axes.xscale = canvas.width / (2 * carrierDuration); // x pixs per s
  axes.yscale = canvas.height / (2 * CARRIER_AMPLITUDE_MAX); // y pixs per V
  axes.sampFreq = SAMPLING_FREQUENCY;

  // samples
  for (let sample = 0; sample < SAMPLING_FREQUENCY; sample++) {
    time[sample] = tstart + sample * dt;
    carrierData[sample] =
      CARRIER_AMPLITUDE * Math.sin(CARRIER_ANGULAR_FREQUENCY * time[sample]);
  }

  // plot function
  graphArray(ctx, axes, time, carrierData, "rgb(255,255,255)", 1);
};

//MESSAGE
const playMessageSignal = () => {
  const ALL_SAMPLES = SOUND_DURATION * SAMPLING_FREQUENCY;
  const CHANNEL_TYPE = 1; //1-mono, 2-stereo

  let audioContext = new AudioContext();

  //CHANNEL_TYPE - mono channel <--> ALL_SAMPLES - samples the buffer should hold <--> SAMPLING_FREQUENCY - sample rate of the buffer
  let buffer = audioContext.createBuffer(
    CHANNEL_TYPE,
    ALL_SAMPLES,
    SAMPLING_FREQUENCY
  );

  let data = buffer.getChannelData(0);

  function generateSample(sample) {
    let time = sample / SAMPLING_FREQUENCY;
    let angle = time * MESSAGE_ANGULAR_FREQUENCY;

    return MESSAGE_AMPLITUDE * Math.sin(angle);
  }

  for (let sample = 0; sample < ALL_SAMPLES; sample++) {
    data[sample] = generateSample(sample);
  }

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
const drawMessageSignal = () => {
  // define canvas
  let canvas = document.querySelector("#my-message-canvas");
  if (null === canvas || !canvas.getContext) return 0;

  let messageDuration = SOUND_DURATION / 100;
  // axes center coordinates
  let axes = {};

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  axes.x0 = 0.5 * canvas.width;
  axes.y0 = 0.5 * canvas.height;

  showAxes(ctx, axes);

  let time = [];
  let messageData = [];

  // define plot paramaters
  let tstart = -messageDuration;
  let tstop = messageDuration; //10ms *2
  let dt = (tstop - tstart) / SAMPLING_FREQUENCY; // time increment

  axes.xscale = canvas.width / (2 * messageDuration); // x pixs per s
  axes.yscale = canvas.height / (2 * MESSAGE_AMPLITUDE_MAX); // y pixs per V
  axes.sampFreq = SAMPLING_FREQUENCY;

  // samples
  for (let sample = 0; sample < SAMPLING_FREQUENCY; sample++) {
    time[sample] = tstart + sample * dt;
    messageData[sample] =
      MESSAGE_AMPLITUDE * Math.sin(MESSAGE_ANGULAR_FREQUENCY * time[sample]);
  }

  // plot function
  graphArray(ctx, axes, time, messageData, "rgb(255,255,255)", 1);
};

//MODULATED
const playModulatedSignal = () => {
  const ALL_SAMPLES = SOUND_DURATION * SAMPLING_FREQUENCY;
  const CHANNEL_TYPE = 1; //1-mono, 2-stereo

  let audioContext = new AudioContext();

  //CHANNEL_TYPE - mono channel <--> ALL_SAMPLES - samples the buffer should hold <--> SAMPLING_FREQUENCY - sample rate of the buffer
  let buffer = audioContext.createBuffer(
    CHANNEL_TYPE,
    ALL_SAMPLES,
    SAMPLING_FREQUENCY
  );

  let data = buffer.getChannelData(0);

  function generateSample(sample) {
    let time = sample / SAMPLING_FREQUENCY;

    return (
      CARRIER_AMPLITUDE *
      Math.cos(
        CARRIER_ANGULAR_FREQUENCY * time +
          BETA * Math.sin(MESSAGE_ANGULAR_FREQUENCY * time)
      )
    );
  }

  for (let sample = 0; sample < ALL_SAMPLES; sample++) {
    data[sample] = generateSample(sample);
  }

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
const drawModulatedSignal = () => {
  let modulatedDuration = SOUND_DURATION / 100;

  // define canvas
  let canvas = document.querySelector("#my-modulated-canvas");
  if (null === canvas || !canvas.getContext) return 0;
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // axes center coordinates
  let axes = {};

  axes.x0 = 0.5 * canvas.width;
  axes.y0 = 0.5 * canvas.height;

  showAxes(ctx, axes);

  let time = [];
  let modulatedData = [];

  // define plot paramaters
  let tstart = -modulatedDuration;
  let tstop = modulatedDuration; //10ms *2
  let dt = (tstop - tstart) / SAMPLING_FREQUENCY; // time increment

  axes.xscale = canvas.width / (2 * modulatedDuration); // x pixs per s
  axes.yscale = canvas.height / (2 * MODULATED_AMPLITUDE_MAX); // y pixs per V
  axes.sampFreq = SAMPLING_FREQUENCY;

  // samples
  for (let sample = 0; sample < SAMPLING_FREQUENCY; sample++) {
    time[sample] = tstart + sample * dt;
    modulatedData[sample] =
      CARRIER_AMPLITUDE *
      Math.cos(
        CARRIER_ANGULAR_FREQUENCY * time[sample] +
          BETA * Math.sin(MESSAGE_ANGULAR_FREQUENCY * time[sample])
      );
  }

  // plot function
  graphArray(ctx, axes, time, modulatedData, "rgb(255,255,255)", 1);
};

//UTIL
const graphArray = (ctx, axes, t, data, color, thick) => {
  let t0 = axes.x0;
  let y0 = axes.y0;
  let xscale = axes.xscale;
  let yscale = axes.yscale;

  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  for (let i = 0; i < axes.sampFreq; i++) {
    // translate actual x,y to plot xp,yp
    let tp = t0 + t[i] * xscale;
    let yp = y0 - data[i] * yscale;

    // draw line to next point
    if (i == 0) ctx.moveTo(tp, yp);
    else ctx.lineTo(tp, yp);
  }

  ctx.stroke();
};
const showAxes = (ctx, axes) => {
  let x0 = axes.x0;
  let width = ctx.canvas.width;
  let y0 = axes.y0;
  let height = ctx.canvas.height;

  ctx.beginPath();
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.moveTo(0, y0);
  ctx.lineTo(width, y0); // X axis
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, height); // Y axis
  ctx.stroke();
};

//S/N RATIO
const handleSNOnInput = (newValue) => {
  const sliderDivCounter = document.querySelector(".slider-counter");
  const enteredValue = Number(newValue);
  sliderDivCounter.innerHTML = `${enteredValue} [decibel]`;
};

//CONTROL PANEL AMPLITUDE, FREQ CHANGE
const handleCarrierAmplitudeChange = (newValue) => {
  const carrierDivAmplitude = document.querySelector(".carrier-div-amplitude");
  const enteredValue = Number(newValue);
  carrierDivAmplitude.innerHTML = `${enteredValue} [V]`;
  CARRIER_AMPLITUDE = enteredValue;
  drawCarrierSignal();
  drawModulatedSignal();
};
const handleCarrierFreqChange = (newValue) => {
  const carrierDivFreq = document.querySelector(".carrier-div-frequency");
  const enteredValue = Number(newValue);
  carrierDivFreq.innerHTML = `${enteredValue} [Hz]`;
  CARRIER_REAL_TIME_FREQUENCY = enteredValue;
  CARRIER_ANGULAR_FREQUENCY = CARRIER_REAL_TIME_FREQUENCY * 2 * Math.PI;
  drawCarrierSignal();
  drawModulatedSignal();
};
const handleMessageAmplitudeChange = (newValue) => {
  const messageDivAmplitude = document.querySelector(".message-div-amplitude");
  const enteredValue = Number(newValue);
  messageDivAmplitude.innerHTML = `${enteredValue} [V]`;
  MESSAGE_AMPLITUDE = enteredValue;
  drawMessageSignal();
  drawModulatedSignal();
};
const handleMessageFreqChange = (newValue) => {
  const messageDivFreq = document.querySelector(".message-div-frequency");
  const enteredValue = Number(newValue);
  messageDivFreq.innerHTML = `${enteredValue} [Hz]`;
  MESSAGE_REAL_TIME_FREQUENCY = enteredValue;
  MESSAGE_ANGULAR_FREQUENCY = MESSAGE_REAL_TIME_FREQUENCY * 2 * Math.PI;
  drawMessageSignal();
  drawModulatedSignal();
};

//INITIAL START / RESET TO DEFAULT PARAMS
const startAppWithDefaultParameters = () => {
  handleCarrierAmplitudeChange(CARRIER_AMPLITUDE);
  handleCarrierFreqChange(CARRIER_REAL_TIME_FREQUENCY);
  handleMessageAmplitudeChange(MESSAGE_AMPLITUDE);
  handleMessageFreqChange(MESSAGE_REAL_TIME_FREQUENCY);
  drawCarrierSignal();
  drawMessageSignal();
  drawModulatedSignal();
};
