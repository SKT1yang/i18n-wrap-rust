var Af = /** @class */ (function () {
  function Af() {
    this.i = 0;
    this.j = 0;
    this.S = [];
  }
  Af.prototype.init = function (key) {
    var i;
    var j;
    var t;
    for (i = 0; i < 256; ++i) {
      this.S[i] = i;
    }
    j = 0;
    for (i = 0; i < 256; ++i) {
      j = (j + this.S[i] + key[i % key.length]) & 255;
      t = this.S[i];
      this.S[i] = this.S[j];
      this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
  };
  Af.prototype.next = function () {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
  };
  return Af;
})();
export { Af };
export function prng_newstate() {
  return new Af();
}
export var rng_psize = 256;
