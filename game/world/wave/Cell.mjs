import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { n0tiles } from "./n0.mjs"

export class Cell {
    constructor(value, tileset) {
      if (value instanceof Array) {
        this.options = value;
        this.option = null
      } else {
        this.options = [];
        for (let i = 0; i < value; i++) {
          this.options[i] = i;
        }
      }
      this.tileset = tileset;
      this.sets = new Set();
      this.filtered = new Set();
      this.neighborStates = new Map();
      this.sideConnection = [];
    }
  noiseThresholdCondition(gencache, o, bias) {
    if (bias == NaN) bias = 0
      let tvt = n0tiles.get(o);
      if (!tvt) return false;
      
      let valid = tvt.thresholds.map(t => {
          let factor = gencache.get(t.factor);
          
          if (!factor) return true;
          let sum =  factor +bias

          let cond = sum > t.min && sum < t.max;
          if (!cond) 
            this.filtered.add(t.factor); //tiles filtered as to give reason for when all tiles fully filter out on a tile
          return cond;
      });

      return valid.every(v => v);
    }
  }
  