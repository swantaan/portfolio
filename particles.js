window.Particles = {
  canvas: null,
  canvasDot: null,
  context: null,
  contextDot: null,
  w: 0,
  h: 0,

  noise: null,
  z: 0,
  zinc: 0.003,
  points: [],

  particleCount: 400,
  velocity: 1.0,
  friction: 0.1,
  scale: 0.016,
  concentration: 0.045,
  dotSizeMultiplier: 2.0,
  blendMode: "overlay",

  isDown: false,
  isPaused: false,

  activeColors: ["#DEDEDE", "#fe6c90", "#d03791", "#87286a", "#452459", "#341147"],
  bgColor: "#0d0d11",

  init() {
    this.noise = new Noise();
    this.canvas = document.querySelector("#particles");
    this.canvasDot = document.querySelector("#particlesDot");

    if (!this.canvas || !this.canvasDot) {
      console.warn("Canvas elements not found in DOM.");
      return;
    }

    this.context = this.canvas.getContext("2d");
    this.contextDot = this.canvasDot.getContext("2d");

    this.resize();
    this.z = Math.random() * 100;
    this.initPoints();
    this.bindEvents();
  },

  getSpawnPoint() {
    const dlmagic = document.querySelector("#dlmagic");
    const rgraphics = document.querySelector("#rgraphics");
    if (dlmagic && rgraphics && this.canvas) {
      const rect1 = dlmagic.getBoundingClientRect();
      const rect2 = rgraphics.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      return {
        x: Math.random() * this.w,
        y: ((rect1.bottom + rect2.top) / 2) - canvasRect.top
      };
    }
    return {
      x: Math.random() * this.w,
      y: this.h / 2
    };
  },

  initPoints() {
    this.noise.seed(Math.random());
    this.points = [];
    const colors = this.activeColors;

    const dlmagic = document.querySelector("#dlmagic");
    const rgraphics = document.querySelector("#rgraphics");
    let initY = this.h / 2;

    if (dlmagic && rgraphics && this.canvas) {
      const rect1 = dlmagic.getBoundingClientRect();
      const rect2 = rgraphics.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      initY = ((rect1.bottom + rect2.top) / 2) - canvasRect.top;
    }

    for (let i = 0; i < this.particleCount; i++) {
      const x = (i / this.particleCount) * this.w;
      const y = initY;

      const lw = Math.random() * 0.15 + 0.1;
      const pScale = Math.random() * 0.015 + 0.005;
      const pColor = colors[Math.floor(Math.random() * colors.length)];

      this.points.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        clr: pColor,
        lw: lw,
        scale: pScale
      });
    }

    this.clear();
  },

  updateParticleColors(colors) {
    this.activeColors = colors;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].clr = colors[Math.floor(Math.random() * colors.length)];
    }
  },

  tick() {
    if (this.isPaused) return;

    const r = this.points.length;

    this.contextDot.clearRect(0, 0, this.w, this.h);

    this.context.globalCompositeOperation = this.blendMode;
    this.contextDot.globalCompositeOperation = "source-over";

    for (let e = 0; e < r; e++) {
      let t = this.points[e];

      let angle;
      let crawlSpeed = this.velocity * 1.6;
      if (this.isDown) {
        crawlSpeed = this.velocity * 6.5;
        angle = this.getValue(t.x, t.y, t.scale * 3.0);
        t.vx = Math.cos(angle) * crawlSpeed;
        t.vy = Math.sin(angle) * crawlSpeed;
      } else {
        angle = this.getValue(t.x, t.y, this.scale);
        t.vx = Math.cos(angle) * crawlSpeed;
        t.vy = Math.sin(angle) * crawlSpeed;
      }

      if (this.concentration > 0) {
        const idealStep = 80 * this.concentration;
        const stepX = this.w / Math.max(1, Math.round(this.w / idealStep));
        const stepY = this.h / Math.max(1, Math.round(this.h / idealStep));

        const boundedX = (t.x % this.w + this.w) % this.w;
        const boundedY = (t.y % this.h + this.h) % this.h;

        const targetX = Math.round(boundedX / stepX) * stepX;
        const targetY = Math.round(boundedY / stepY) * stepY;

        let dx = targetX - boundedX;
        let dy = targetY - boundedY;

        if (dx > this.w * 0.5) dx -= this.w;
        else if (dx < -this.w * 0.5) dx += this.w;

        if (dy > this.h * 0.5) dy -= this.h;
        else if (dy < -this.h * 0.5) dy += this.h;

        t.vx += dx * 0.035 * this.concentration;
        t.vy += dy * 0.035 * this.concentration;
      }

      if (this.concentration < 1.0) {
        const scatterForce = (1.0 - this.concentration) * 0.15;
        t.vx += (Math.random() - 0.5) * scatterForce;
        t.vy += (Math.random() - 0.5) * scatterForce;
      }

      const oldX = t.x;
      const oldY = t.y;

      t.x += t.vx;
      t.y += t.vy;

      const margin = 40;
      let wrapped = false;

      if (t.x >= this.w + margin) {
        t.x -= (this.w + 2 * margin);
        wrapped = true;
      } else if (t.x < -margin) {
        t.x += (this.w + 2 * margin);
        wrapped = true;
      }
      if (t.y >= this.h + margin) {
        t.y -= (this.h + 2 * margin);
        wrapped = true;
      } else if (t.y < -margin) {
        t.y += (this.h + 2 * margin);
        wrapped = true;
      }

      this.context.globalAlpha = 0.55;
      this.context.strokeStyle = t.clr;
      this.context.lineWidth = t.lw * 3.0;

      if (!wrapped) {
        this.context.beginPath();
        this.context.moveTo(oldX, oldY);
        this.context.lineTo(t.x, t.y);
        this.context.stroke();
      }
      this.context.globalAlpha = 1.0;

      const radius = 0.65 * this.dotSizeMultiplier;
      this.contextDot.fillStyle = "#fe6c90";
      this.contextDot.globalAlpha = 0.85;

      this.contextDot.beginPath();
      this.contextDot.arc(t.x, t.y, radius, 0, 2 * Math.PI);
      this.contextDot.fill();

      this.contextDot.globalAlpha = 1.0;

      t.vx *= this.friction;
      t.vy *= this.friction;
    }

    this.z += this.zinc;
  },

  getValue(x, y, scale) {
    return this.noise.perlin3(x * scale, y * scale, this.z) * Math.PI * 4;
  },

  resize() {
    const canvasesWrapper = document.querySelector("#canvases");
    if (canvasesWrapper) {
      this.w = canvasesWrapper.clientWidth;
      this.h = canvasesWrapper.clientHeight;
    } else {
      this.w = window.innerWidth;
      this.h = window.innerHeight;
    }

    this.canvas.width = this.canvasDot.width = this.w;
    this.canvas.height = this.canvasDot.height = this.h;

    this.clear();
    this.initPoints();
  },

  clear() {
    this.context.clearRect(0, 0, this.w, this.h);
    this.contextDot.clearRect(0, 0, this.w, this.h);
  },

  bindEvents() {
    const onDown = () => {
      this.isDown = true;
    };
    const onUp = () => {
      this.isDown = false;
    };

    if (this.canvasDot) {
      this.canvasDot.addEventListener("mousedown", onDown);
      this.canvasDot.addEventListener("touchstart", onDown);
    }

    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  }
};
