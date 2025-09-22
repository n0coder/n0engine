export class Sparse2dMap<T> {
    constructor() {
        this.tiles = new Map();
        this.offset = 2 ** 15;
    }
    tiles: Map<string|number|bigint|boolean, T|{  }>
    offset: number
    set(x:number, y:number, tile: any) {
        const key = this.getKey(x, y);
        this.tiles.set(key, tile);
    }

    get(x:number, y:number) {
        const key = this.getKey(x, y);
        return this.tiles.get(key);
    }
    getKey(x:number, y:number) {
        const shiftedX = x + this.offset;
        const shiftedY = y + this.offset;
        return (BigInt(shiftedX) << 32n) | BigInt(shiftedY & 0xFFFFFFFF);
    }

  // Decode key back to x, y (optional, for debugging or iteration)
    getCoords(key) {
        const x = Number((key >> 32n)) - this.offset;
        const y = Number(key & 0xFFFFFFFFn) - this.offset;
        return { x, y };
    }

}
