// Abstract Wireless City Visualization
// Inspired by urban contour and wireless communication aesthetics

// Color palettes - abstract urban wireless themes
let wirelessColors = [
  // Golden signals
  "f9c80e-f86624-ea3546-ff6b35-f7931e-ffb347-ffd700-fff8dc"
    .split("-")
    .map((a) => "#" + a),
  // Tech blues
  "1e3a8a-3b82f6-60a5fa-93c5fd-dbeafe-87ceeb-4682b4-191970"
    .split("-")
    .map((a) => "#" + a),
  // Urban warm
  "d97706-f59e0b-fbbf24-fde047-facc15-eab308-ca8a04-a16207"
    .split("-")
    .map((a) => "#" + a),
  // Signal spectrum
  "7c3aed-8b5cf6-a78bfa-c4b5fd-ddd6fe-e879f9-f472b6-fb7185"
    .split("-")
    .map((a) => "#" + a),
  // Electric cyan
  "0891b2-0e7490-155e75-06b6d4-67e8f9-a7f3d0-6ee7b7-3b82f6"
    .split("-")
    .map((a) => "#" + a),
];

let colors = [];
let accentColors = [];
let graphics;
let overlayGraphics;
let signalParticles = [];
let dataFlows = [];
let wirelessNodes = [];

// Abstract art parameters
let tiltAngle = 0;
let tiltPan = 0;
let rotationTiltRatio = 0;
let tiltCenter;
let noiseConst1, noiseConst2, noiseConst3;
let timeOffset = 0;
let signalStrength = 1.0;
let renderStartFrame = 0;

// Blockchain simulation functions
function generateBlockHash(timestamp) {
  // Simulate blockchain hash generation using timestamp and random factors
  let seed = timestamp + Math.floor(Math.random() * 1000000);
  let hashStr = seed.toString(16);
  
  // Add some pseudo-randomness to mimic blockchain hash complexity
  let complexity = '';
  for (let i = 0; i < 8; i++) {
    complexity += Math.floor(Math.random() * 16).toString(16);
  }
  
  return (hashStr + complexity).substring(0, 16);
}

function generateTokenId() {
  // Generate a unique token ID
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Wireless signal particle class
class WirelessSignal {
  constructor(args) {
    let def = {
      p: createVector(0, 0),
      v: createVector(0, 0),
      a: createVector(0, 0),
      length: random(20, 200),
      color: color(255),
      endColor: color(255, 0),
      dashPattern: random([3, 8, 15, 25]),
      shrinkRatio: random(0.98, 0.995),
      thickness: random(1, 4),
      frequency: random(0.01, 0.05),
      amplitude: random(10, 50),
      signalType: random([
        "data",
        "wifi",
        "cellular",
        "bluetooth",
        "radio",
      ]),
      randomId: int(random(100000)),
      rotSpeed: random(-0.02, 0.02),
      glitchFactor: random(0, 0.3),
      pulsePhase: random(TWO_PI),
    };
    Object.assign(def, args);
    Object.assign(this, def);
  }

  draw() {
    graphics.push();

    // Shadow effects for depth
    if (this.randomId % 3 === 0) {
      graphics.drawingContext.shadowOffsetX = 2;
      graphics.drawingContext.shadowOffsetY = -2;
      graphics.drawingContext.shadowColor = color(50, 100);
    } else if (this.randomId % 5 === 0) {
      graphics.drawingContext.shadowOffsetX = -3;
      graphics.drawingContext.shadowOffsetY = -3;
      graphics.drawingContext.shadowColor = color(0, 120);
    }

    graphics.translate(this.p.x, this.p.y);

    // Time-based color transition (relative to last regeneration)
    let elapsedFrames = Math.max(frameCount - renderStartFrame, 0);
    let timeProgress = map(constrain(elapsedFrames / 120, 0, 1), 0, 1, 1, 0);
    let colorProgress = 1 - pow(timeProgress, 2);
    let currentColor = lerpColor(
      this.color,
      this.endColor,
      colorProgress
    );

    // Rotation and positioning
    let positionTilt =
      atan2(
        this.p.y - height * tiltCenter.x,
        this.p.x - width * tiltCenter.y
      ) / 15;
    positionTilt +=
      map(noise(noiseConst1 + frameCount * 0.01), 0, 1, -1, 1) *
      rotationTiltRatio *
      PI;

    if (this.randomId % 2 === 0) {
      graphics.rotate(
        tiltAngle + tiltPan + positionTilt + this.rotSpeed * frameCount
      );
    } else {
      graphics.rotate(
        -tiltAngle + tiltPan + positionTilt - this.rotSpeed * frameCount
      );
    }

    // Signal-specific visual patterns
    graphics.stroke(currentColor);
    graphics.strokeWeight(this.thickness);
    graphics.noFill();

    // Set dash patterns for wireless signals
    if (frameCount % (this.dashPattern + 5) < this.dashPattern) {
      graphics.drawingContext.setLineDash([this.dashPattern, 3]);
    } else {
      graphics.drawingContext.setLineDash([0]);
    }

    // Draw signal based on type
    this.drawSignalPattern();

    // Glitch effects
    if (random() < this.glitchFactor * 0.1) {
      graphics.translate(random(-3, 3), random(-3, 3));
    }

    // Pulse effects for active signals
    if (this.signalType === "wifi" || this.signalType === "cellular") {
      let pulse =
        sin(frameCount * this.frequency + this.pulsePhase) * 0.5 + 0.5;
      graphics.strokeWeight(this.thickness * (1 + pulse));
    }

    // Random interference
    if (random() < 0.008) {
      this.p.x += random(-20, 20);
      this.p.y += random(-20, 20);
    }

    graphics.pop();
  }

  drawSignalPattern() {
    switch (this.signalType) {
      case "wifi":
        // Wave-like pattern
        for (let i = 0; i < this.length; i += 5) {
          let wave =
            sin(i * 0.1 + frameCount * 0.05) * this.amplitude * 0.3;
          graphics.line(
            i,
            wave,
            i + 5,
            sin((i + 5) * 0.1 + frameCount * 0.05) * this.amplitude * 0.3
          );
        }
        break;

      case "cellular":
        // Strong linear signals with branches
        graphics.line(0, 0, this.length, 0);
        if (this.randomId % 7 === 0) {
          let branches = 3;
          for (let b = 0; b < branches; b++) {
            let branchX = (this.length * (b + 1)) / (branches + 1);
            let branchY = random(-30, 30);
            graphics.line(branchX, 0, branchX + 20, branchY);
          }
        }
        break;

      case "bluetooth":
        // Short range, curved signals
        let bluetoothSegments = 5;
        for (let s = 0; s < bluetoothSegments; s++) {
          let x1 = (s * this.length) / bluetoothSegments;
          let x2 = ((s + 1) * this.length) / bluetoothSegments;
          let curve = sin(s + frameCount * 0.03) * 15;
          graphics.line(
            x1,
            curve,
            x2,
            sin(s + 1 + frameCount * 0.03) * 15
          );
        }
        break;

      case "radio":
        // Broad wave patterns
        graphics.line(0, 0, this.length * 0.8, 0);
        for (let r = 1; r <= 3; r++) {
          let radioWave = sin(frameCount * 0.02 + r) * r * 10;
          graphics.arc(0, 0, r * 40, r * 40, 0, PI);
        }
        break;

      case "data":
      default:
        // Data stream - interrupted lines
        let dataSegments = int(this.length / 10);
        for (let d = 0; d < dataSegments; d++) {
          if (random() > 0.3) {
            let x1 = d * 10;
            let x2 = (d + 1) * 10;
            let dataFlow = sin(d + frameCount * 0.1) * 5;
            graphics.line(
              x1,
              dataFlow,
              x2,
              sin(d + 1 + frameCount * 0.1) * 5
            );
          }
        }
        break;
    }
  }

  update() {
    this.p.add(this.v);
    this.v.add(this.a);
    this.length *= this.shrinkRatio;

    // Organic movement
    if (this.randomId % 4 === 0) {
      this.v.rotate(sin(this.p.x * 0.01 + this.p.y * 0.01) * 0.05);
      this.v.rotate(this.rotSpeed);
    }

    // Signal interference patterns
    if (this.randomId % 11 === 0 && frameCount % 60 === 0) {
      this.v.rotate(random([-1, 1]) * tiltAngle * 0.5);
    }

    // Fade out signals randomly
    if (random() < 0.005) {
      this.color = lerpColor(this.color, this.endColor, 0.1);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize parameters
  colors = random(wirelessColors);
  accentColors = random(wirelessColors.filter((c) => c !== colors));

  noiseConst1 = random(1000000);
  noiseConst2 = random(1000000);
  noiseConst3 = random(1000000);

  tiltAngle = PI / random(8, 12);
  tiltPan = (random(-1, 1) * PI) / 20;
  rotationTiltRatio = random(-0.2, 0.2);
  tiltCenter = createVector(random(0.2, 0.8), random(0.2, 0.8));

  graphics = createGraphics(width, height);
  overlayGraphics = createGraphics(width, height);

  // Initialize backgrounds on both main canvas and offscreen buffer
  background(10, 8, 15);
  graphics.background(10, 8, 15);
  renderStartFrame = frameCount;

  generateWirelessSignals();
  updateStatus("SIGNALS SYNCHRONIZED");
}

function generateWirelessSignals() {
  signalParticles = [];
  dataFlows = [];

  // Generate wireless signals at multiple scales
  let densities = [
    { span: random(15, 25), count: 0 },
    { span: random(40, 60), count: 0 },
    { span: random(80, 120), count: 0 },
    { span: random(160, 240), count: 0 },
    { span: random(300, 500), count: 0 },
  ];

  densities.forEach((density, layerIndex) => {
    for (let x = 0; x < width; x += density.span) {
      for (let y = 0; y < height; y += density.span) {
        // Skip some positions randomly for organic feel
        if (random() < 0.4) continue;

        // Noise-based positioning
        if (noise(x * 0.01, y * 0.01, layerIndex * 100) < 0.3) continue;

        let colorPick = random() < 0.8 ? colors : accentColors;
        let signalColor = color(random(colorPick));
        let endColor = color(random(colorPick));
        endColor.setAlpha(0);

        // Position with organic noise
        let _x = x,
          _y = y;
        if (noise(x * 0.02, y * 0.02) > 0.4) {
          _x += noise(x * 0.03, y * 0.03) * 40;
          _y += noise(1000, x * 0.03, y * 0.03) * 40;
        }

        // Create wireless signal
        let signal = new WirelessSignal({
          p: createVector(_x, _y),
          v: createVector(
            random(-0.5, 0.5),
            random(-1, -2) * (1 + layerIndex * 0.2)
          ),
          length: density.span + random(20, 100),
          color: signalColor,
          endColor: endColor,
          thickness: map(layerIndex, 0, densities.length - 1, 1, 4),
          signalType: random([
            "wifi",
            "cellular",
            "bluetooth",
            "data",
            "radio",
          ]),
        });

        signalParticles.push(signal);
        density.count++;
      }
    }
  });

  // Add some special highlight signals
  signalParticles.forEach((signal) => {
    if (random() < 0.08) {
      signal.color.setAlpha(150);
      signal.glitchFactor = 0.5;
    }
    if (random() < 0.02) {
      signal.color = color("#ff6b35");
      signal.signalType = "cellular";
    }
  });

  // Sort by depth
  signalParticles.sort((a, b) => (random() < 0.3 ? a.p.y - b.p.y : 0));

  console.log(`Generated ${signalParticles.length} wireless signals`);
}

function draw() {
  // Subtle rotation
  graphics.push();

  // Update and draw all signals
  signalParticles.forEach((signal) => {
    signal.update();
    signal.draw();
  });

  graphics.pop();

  // Complex blending for abstract art effect
  push();
  scale(1.05); // Slight zoom for edge softening

  // Multiple layer blending
  image(graphics, -width * 0.025, -height * 0.025);

  blendMode(MULTIPLY);
  image(graphics, -width * 0.025, -height * 0.025);

  blendMode(SOFT_LIGHT);
  image(graphics, -width * 0.025, -height * 0.025);

  blendMode(SCREEN);
  tint(255, 30);
  image(graphics, -width * 0.025, -height * 0.025);

  noTint();
  blendMode(BLEND);

  // Blur filter
  drawingContext.filter = "blur(0.5px)";

  pop();

  timeOffset += 0.01;
}

function updateStatus(message) {
  let statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.textContent = message;
  }
}

// Regenerate everything without reloading the page
function regenerateArtwork() {
  // Reset core parameters similar to initial setup
  colors = random(wirelessColors);
  accentColors = random(wirelessColors.filter((c) => c !== colors));

  noiseConst1 = random(1000000);
  noiseConst2 = random(1000000);
  noiseConst3 = random(1000000);

  tiltAngle = PI / random(8, 12);
  tiltPan = (random(-1, 1) * PI) / 20;
  rotationTiltRatio = random(-0.2, 0.2);
  tiltCenter = createVector(random(0.2, 0.8), random(0.2, 0.8));

  // Clear existing graphics instead of recreating
  graphics.clear();
  overlayGraphics.clear();
  // Reset backgrounds on existing canvas
  background(10, 8, 15);
  graphics.background(10, 8, 15);

  // Re-generate scene
  renderStartFrame = frameCount;
  timeOffset = 0;
  generateWirelessSignals();
  updateStatus("SIGNALS REGENERATED");

  // Ensure an immediate frame is drawn
  if (typeof redraw === "function") {
    redraw();
  }
}

// Interaction handlers - mouse interaction removed

function keyPressed() {
  if (key === " ") {
    regenerateArtwork();
    return false; // prevent default space behavior
  }

  if (key === "s" || key === "S") {
    // Generate blockchain-inspired filename
    let timestamp = Date.now();
    let blockHash = generateBlockHash(timestamp);
    let filename = `Unendlichkeit_Stream_0x${blockHash}_${timestamp}.jpg`;
    save(filename);
    updateStatus(`MINTED: ${filename}`);
  }

  if (key === "r" || key === "R") {
    // Reset graphics
    graphics.clear();
    background(10, 8, 15);
    updateStatus("CANVAS RESET");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graphics = createGraphics(width, height);
  graphics.background(10, 8, 15);
  generateWirelessSignals();
  renderStartFrame = frameCount;
}

setInterval(() => {
  regenerateArtwork();
  console.log("Regenerated at Count:", 1);
}, 60000);