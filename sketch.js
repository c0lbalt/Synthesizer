let synth1;
let filt;
let rev;
let distortion;
let activeKey = null;

let attackSlider, decaySlider, sustainSlider, releaseSlider;
let distortionSlider, filterSlider;
let effectToggle;
let effectsEnabled = true;

let keyNotes = {
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'h': 'A4',
    'j': 'B4',
    'k': 'C5'
};

function setup() {
  createCanvas(600, 500);
  Tone.start();

  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  distortion = new Tone.Distortion(0).connect(filt);

  synth1 = new Tone.Synth({
      envelope: {
          attack: 0.1,
          decay: 0.5,
          sustain: 0.8,
          release: 0.3,
      },
      oscillator: {
        type: 'sawtooth',
      }
  });

  synth1.connect(rev);
  synth1.connect(distortion);

  // Envelope Sliders
  attackSlider = createSlider(0, 1, 0.1, 0.01).position(10, 50);
  attackSlider.input(() => { synth1.envelope.attack = attackSlider.value(); });

  decaySlider = createSlider(0, 1, 0.5, 0.01).position(10, 95);
  decaySlider.input(() => { synth1.envelope.decay = decaySlider.value(); });

  sustainSlider = createSlider(0, 1, 0.8, 0.01).position(10, 140);
  sustainSlider.input(() => { synth1.envelope.sustain = sustainSlider.value(); });

  releaseSlider = createSlider(0, 1, 0.3, 0.01).position(10, 185);
  releaseSlider.input(() => { synth1.envelope.release = releaseSlider.value(); });

  // Distortion Slider
  distortionSlider = createSlider(0, 1, 0, 0.01).position(200, 50);
  distortionSlider.input(() => { 
    distortion.distortion = distortionSlider.value();
  });

  // Filter Slider
  filterSlider = createSlider(200, 5000, 1000, 10).position(200, 95);
  filterSlider.input(() => { 
    filt.frequency.value = filterSlider.value();
  });

  // Effect Toggle Button
  effectToggle = createButton("Effects: ON").position(200, 140);
  effectToggle.mousePressed(() => {
    effectsEnabled = !effectsEnabled;
    if (effectsEnabled) {
      synth1.connect(rev);
      synth1.connect(distortion);
      effectToggle.html("Effects: ON");
    } else {
      synth1.disconnect();
      synth1.connect(filt); // Dry sound
      effectToggle.html("Effects: OFF");
    }
  });
}

function draw() {
  background(220);  

  textSize(12);
  fill(0);
  text("Attack: " + attackSlider.value().toFixed(2), 10, 45);
  text("Decay: " + decaySlider.value().toFixed(2), 10, 90);
  text("Sustain: " + sustainSlider.value().toFixed(2), 10, 135);
  text("Release: " + releaseSlider.value().toFixed(2), 10, 180);

  text("Distortion: " + distortionSlider.value().toFixed(2), 200, 45);
  text("Filter Cutoff: " + filterSlider.value().toFixed(0) + " Hz", 200, 90);

  text("Press keys for notes:", 10, 220);
  text("'A' → C4", 15, 240);
  text("'S' → D4", 15, 260);
  text("'D' → E4", 15, 280);
  text("'F' → F4", 15, 300);
  text("'G' → G4", 15, 320);
  text("'H' → A4", 15, 340);
  text("'J' → B4", 15, 360);
  text("'K' → C5", 15, 380);
} 

function keyPressed() {
    let pitch = keyNotes[key.toLowerCase()];
    if (pitch && key !== activeKey) {
        if (activeKey) {
            synth1.triggerRelease();
        }
        activeKey = key;
        synth1.triggerAttack(pitch);
    }
}

function keyReleased() {
    if (activeKey) {
        synth1.triggerRelease();
        activeKey = null;
    }
}
