import { lerp } from "../n0math/ranges.mjs";

export class RangeMap {
    constructor(i,o) {
        this.i = i;
        this.o = o;
        this.array = [];
        this.total = 0;
    }
    add(biome,weight) {
        weight |= 1;
        this.array.push({biome, weight});
        this.total += weight;
        return this;
    }
    remove(biome) {
        const index = this.array.findIndex(i => i.biome === biome);
        if (index !== -1) {
          this.array.splice(index, 1);
          this.total -= this.array[index].weight;
        }
      }
      exportRanges() {
        const outputRanges = [];
        let accumulatedSize = 0;
        let length = this.array.length;
        for (let i = 0; i < length; i++) {
          const item = this.array[i];
          let size = item.weight / this.total;
          size = lerp(this.i, this.o, size);
          outputRanges.push([item.biome, accumulatedSize, accumulatedSize + size, this.total]);
          accumulatedSize += size;
        }
        
        return outputRanges;
      }
      
    get(value) {
        let accumulatedSize = 0;
        let length = this.array.length;
        for (let i = 0; i < length; i++) {
          const item = this.array[i];
          let size = item.weight / this.total;
          size = lerp(this.i, this.o, size);
      
          if (value > accumulatedSize && value < accumulatedSize + size) {
            return item;
          }
          accumulatedSize += size;
        }
      }
      
}