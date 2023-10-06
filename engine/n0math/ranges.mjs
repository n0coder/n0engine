export function inverseLerp(a, b, t) {
    return (t - a) / (b - a);
  }
export function lerp(a, b, t) {
    return a + (b - a) * t;
  }
export function remap(a, b, a2, b2, t) {
    return ((t - a) / (b - a)) * (b2 - a2) + a2;
  }
  export function clamp(i,o, t) {
    if (t < i) t=i;
    if (t>o) t = o
    return t;
  }