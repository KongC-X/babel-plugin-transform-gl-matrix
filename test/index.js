const { vec2 } = require('gl-matrix');

const a = vec2(1, 2);
const b = vec2(3, 4);
const c = vec2(a) + vec2(b);

const d = vec2(a) + 1.0;
const e = vec2(a) + vec2(b) + vec2(c);
const f = 2.0 + vec2(a);
const g = -vec2(a);