class Noise {
  constructor() {
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    this.seed(Math.random());
  }

  seed(val) {
    if (val > 0 && val < 1) {
      val *= 65536;
    }
    val = Math.floor(val);
    if (val < 256) {
      val |= val << 8;
    }

    const t = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
      142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,
      203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,
      175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
      133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161, 1,216,
      80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,189,143,244,
      204,115,85,124,220,201,155,47,40,80,52,51,206,140,144,117,141,178,37,
      16,66,104,217,58,195,168,250,218,10,128,1,45,216,84,187,22,38,136,129,
      155,109,37,183,85,253,30,9,41,8,44,80,68,168,78,162,180,81,51,191,8,12,
      22,231,233,88,119,137,86,107,236,125,244,142,98,223,124,196,150,224,
      82,86,68,52,140,241,123,38,47,107,43,46,12,47,178,252,193,80,121,249,
      41,248,152,8,21,180,242,125,236,49,36,79,133,191,5,39,262,49,190,95,
      28,37,24,188,228,80,230,241,6,126,117,82,76,101,155,27,108,86,244,
      116,85,170,150,224,143,109,139,120
    ];

    for (let i = 0; i < 256; i++) {
      let m = i & 1 ? t[i] ^ (val & 255) : t[i] ^ ((val >> 8) & 255);
      this.p[i] = m;
      this.perm[i] = this.perm[i + 256] = m;
      this.permMod12[i] = this.permMod12[i + 256] = m % 12;
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  perlin3(x, y, z) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    let Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A  = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B  = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(this.grad(this.perm[AA], x, y, z),
                  this.grad(this.perm[BA], x - 1, y, z), u),
        this.lerp(this.grad(this.perm[AB], x, y - 1, z),
                  this.grad(this.perm[BB], x - 1, y - 1, z), u), v),
      this.lerp(
        this.lerp(this.grad(this.perm[AA + 1], x, y, z - 1),
                  this.grad(this.perm[BA + 1], x - 1, y, z - 1), u),
        this.lerp(this.grad(this.perm[AB + 1], x, y - 1, z - 1),
                  this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1), u), v), w
    );
  }
}
