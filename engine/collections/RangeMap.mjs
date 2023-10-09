import { inverseLerp, lerp } from "../n0math/ranges.mjs";

export class RangeMap {
    constructor(i,o) {
        this.i = i;
        this.o = o;
        this.array = [];
        this.total = 0;
    }
    add(biome,weight=1) {
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
      exportRanges(i,o) {
        i = i||this.i||0
        o= o||this.o||0
        const outputRanges = [];
        let accumulatedSize = 0;
        let length = this.array.length;
        for (let i = 0; i < length; i++) {
          const item = this.array[i];
          let size = item.weight / this.total;
          //size = 

          var aSziz = lerp(i, o, accumulatedSize);
          var aszizS = lerp(i, o, accumulatedSize+ size);

          outputRanges.push([item.biome, aSziz, aszizS, this.total]);
          accumulatedSize += size;
        }
        
        return outputRanges;
      }
      //i think we're comparing
    get(value, i,o) {
        var v = inverseLerp(i||this.i||0, o||this.o||0, value)
        //lookup value


        let accumulatedSize = 0;
        let length = this.array.length;
        for (let i = 0; i < length; i++) {
          const item = this.array[i];
          let size = item.weight / this.total;
          //size = lerp(this.i, this.o, size);
          //console.log([value, item.weight, this.total, accumulatedSize, accumulatedSize+size, size])
          if (v >= accumulatedSize && v < accumulatedSize + size) {
            return item.biome;
          }
          accumulatedSize += size;
        }
      }
      
}