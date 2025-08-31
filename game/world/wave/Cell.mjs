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
      this.sideConnection = [];
    }
  }
  