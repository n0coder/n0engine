import { loadImg } from "../../../engine/core/Utilities/ObjectUtils.mjs";

export class Tile {
    constructor(img, edges) {
        loadImg(this, "img", img );
        var [up, right, down, left] = edges
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
    }
    init() {
        
    }
    isLeft(tile) {
        var [a,b,c] = this.left
        var [i,o,p] = tile.right;
        return (a===i&&b===o&&c===p);
    }
    isRight(tile) {
        var [a,b,c] = this.right
        var [i,o,p] = tile.left;
        return (a===i&&b===o&&c===p);
    }
    isUp(tile) {
        
        var [a,b,c] = this.up
        var [i,o,p] = tile.down;
        return (a===i&&b===o&&c===p);
    }
    isDown(tile) {
        var [a,b,c] = this.down
        var [i,o,p] = tile.up;
        return (a===i&&b===o&&c===p);
    }
}