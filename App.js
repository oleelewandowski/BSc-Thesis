const REAL_TIME_FREQUENCY = 880;
const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;
const SAMPLING_FREQUENCY = 44100;
const DURATION = 1; //sound 1s draw 10ms
const AMPLITUDE = 0.3;

const playCarrierSignal = () => {
  const ALL_SAMPLES = DURATION * SAMPLING_FREQUENCY; //all samples
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
    let angle = time * ANGULAR_FREQUENCY;

    return AMPLITUDE * Math.sin(angle);
  }

  for (let sample = 0; sample < ALL_SAMPLES; sample++) {
    data[sample] = generateSample(sample);
  }

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};
function drawCarrierSignal() {
  let carrierAmplitude = 0.5; // V
  let carrierDuration = DURATION / 100;

  // define canvas
  let canvas = document.querySelector("#myCanvas");
  if (null === canvas || !canvas.getContext) return;
  ctx = canvas.getContext("2d");

  // axes center coordinates
  let axes = {
    x0: 0.5 * canvas.width,
    y0: 0.5 * canvas.height,
  };

  showAxes(ctx, axes);

  let time = [];
  let data = [];

  // define plot paramaters
  let tstart = -carrierDuration;
  let tstop = carrierDuration; //10ms *2
  let dt = (tstop - tstart) / SAMPLING_FREQUENCY; // time increment
  axes.xscale = canvas.width / (2 * carrierDuration); // x pixs per s
  axes.yscale = canvas.height / (2 * carrierAmplitude); // y pixs per V
  axes.sampFreq = SAMPLING_FREQUENCY;

  // samples
  for (let sample = 0; sample < SAMPLING_FREQUENCY; sample++) {
    time[sample] = tstart + sample * dt;
    data[sample] = AMPLITUDE * Math.sin(ANGULAR_FREQUENCY * time[sample]);
  }

  // plot function
  graphArray(ctx, axes, time, data, "rgb(255,255,255)", 2);
}
function graphArray(ctx, axes, t, data, color, thick) {
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
}
function showAxes(ctx, axes) {
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
}
