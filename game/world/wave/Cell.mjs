import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { n0tiles } from "./n0FunctionCollapse.mjs";

export class Cell {
    constructor(value) {
      if (value instanceof Array) {
        this.options = value;
        this.option = null
      } else {
        this.options = [];
        for (let i = 0; i < value; i++) {
          this.options[i] = i;
        }
      }
    }
  noiseThresholdCondition(gencache, o, bias) {
    if (bias == NaN) bias = 0
      let tvt = n0tiles.get(o);
      if (!tvt) return false;

      let valid = tvt.thresholds.map(t => {
          let factor = gencache.get(t.factor);
          
          if (!factor) return false;
          let sum =  factor +bias
          return sum > t.min && sum < t.max;
      });

      return valid.every(v => v);
    }
  }
  