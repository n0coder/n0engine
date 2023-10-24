
import { Cell } from "./Cell.mjs";
export var n0grid = new Map();
export var n0tiles = new Map();
export class n0FunctionCollapse {
    constructor(alea) {

        this.alea = alea || Math.random
    }

    blocks(size = 5, w, h, rules) {
        for (let i = 0; i <= w; i += size - 1) {
            for (let o = 0; o <= h; o += size - 1) {
                
                this.block(i, o, size,w,h, rules)
                
            }
        }

    }
    block(i, o, size, w,h, rules) {
        let good = true;
        let broken = [];
        for (let x = 0; x < size; x++) {
            if (i + x > w) break;
            for (let y = 0; y < size; y++) {
                if (o + y > h) break;
                let k = `${i+x}, ${y+o}`;

                var iv = n0grid.get(k)
                if (iv) {
                    if (iv.option == null)   {
                        n0grid.set(k, new Cell(rules))
                        console.log(iv)
                    }
                }
            }
        }
        //my algorithm is broken because we're not backtracking
        for (let x = 0; x < size; x++) {
            if (i + x >= w) break;
            for (let y = 0; y < size; y++) {
                if (o + y >= h) break;

                    this.collapseAll(i + x, o + y);
                    //if (option == null) good = false;
                
            }
        }
        return good;
    }

    collapseAll(x, y) {
        var visited = new Map;
        var later = [];
        later.push([x, y]);
        do {
            var a = later[0];
            if (!visited.get(`${a[0]}, ${a[1]}`)) {
            var o = this.collapseTile(a[0], a[1]).later;
            visited.set(`${a[0]}, ${a[1]}`, true);
                for (const point of o) {
                    if (visited.get(`${point[0]}, ${point[1]}`)) continue;
                    later.push(point);
                }
            later.shift();
            } else later.shift();
        } while (later.length > 0);
    }

    collapseTile(x, y, rules) {
        let tile = n0grid.get(`${x}, ${y}`)
        if (rules != null) {
        if (!tile) {
            tile = new Cell(rules)
            n0grid.set(`${x}, ${y}`, tile)
        }
        }
        var myOptions = tile.options.slice();

        let later = []
        checkDir(x, y - 1, (a, b) => n0tiles.get(a).isUp(n0tiles.get(b.option)))
        checkDir(x + 1, y, (a, b) => n0tiles.get(a).isRight(n0tiles.get(b.option)))
        checkDir(x, y + 1, (a, b) => n0tiles.get(a).isDown(n0tiles.get(b.option)))
        checkDir(x - 1, y, (a, b) => n0tiles.get(a).isLeft(n0tiles.get(b.option)))
        tile.option = this.weightedRandom(myOptions);

        return { later, option: tile.option };
        function checkDir(x, y, conditionFunc) {
            var b = n0grid.get(`${x}, ${y}`);
            if (b == null) return;
            if (b.option != null)
                myOptions = myOptions.filter(a => conditionFunc(a, b));
            else later.push([x, y]);
        }
    }

    drawTile(i, o, draw) {
        let index = `${i}, ${o}`;
        let cell = n0grid.get(index);
        if (cell && typeof cell.option === 'string') {
            var img = n0tiles.get(cell.option).img
            if (img)
                draw(img);
        }
    }
    weightedRandom(items) {
        var broken = items.filter(a => n0tiles.get(a) == null)
        if (broken.length > 0) {
            console.warn("these input rules do not have tiles accociated with them", broken)
            items = items.filter(a => n0tiles.get(a) != null)
        }
        var totalWeight = items.reduce((total, item) => total + (n0tiles.get(item).weight || 1), 0);
        var random = this.alea() * totalWeight;
        var cumulativeWeight = 0;
        for (var i = 0; i < items.length; i++) {
            cumulativeWeight += n0tiles.get(items[i]).weight || 1;
            if (random < cumulativeWeight) {
                return items[i];
            }
        }
    }
}