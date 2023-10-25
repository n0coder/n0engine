
import { Cell } from "./Cell.mjs";
export var n0grid = new Map();
export var n0tiles = new Map();
export var n0jointtiles = new Map();
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
    blocksBiome(x,y, w, h, size) { 
        for (let i = 0; i <= w; i++) {
        for (let o = 0; o <= h; o++) {
            this.block(x+i, y+o, w,h)
        }
    }
    }
    block(i, o, w,h) {
        let good = true;
        let broken = [];

        
        for (let x = -1; x < 1; x++) {
            let ix = i+x;
            if (ix > i+w) break;
            for (let y = -1; y < 1; y++) {
                let oy = o+y;
                if (oy> o+h) break;
                let k = `${ix}, ${oy}`;

                var iv = n0grid.get(k)
                
                if (iv) {
                    if (iv.tile.option == null)   {
                        let biomes = []
                        var uiv = n0grid.get(`${ix}, ${oy-1}`)
                        if (uiv&& uiv.tile.option && uiv.biome) biomes.push(uiv.biome.name)
                        var riv = n0grid.get(`${ix+1}, ${oy}`)
                        if (riv&& riv.tile.option&& riv.biome)  biomes.push(riv.biome.name)
                        var div = n0grid.get(`${ix}, ${oy+1}`)
                        if (div&& div.tile.option&& div.biome)  biomes.push(div.biome.name)
                        var liv = n0grid.get(`${ix-1}, ${oy}`)
                        if (liv&& liv.tile.option&& liv.biome) biomes.push(liv.biome.name)
                        biomes = [...new Set(biomes)];
                        biomes.sort();
                        var combinations = [];
                        for (var i = 0; i < biomes.length; i++) {
                            for (var j = i + 1; j < biomes.length; j++) {
                                combinations.push(biomes[i] + "+" + biomes[j]);
                            }
                        }
                        var rules = combinations.map(c=> n0jointtiles.get(c)) 
                        rules = rules.flat(3);
                        n0grid.set(k, {tile: new Cell(rules)})
                        broken.push([ix,oy]);
                    }
                }
            }
        }

        for (const b of broken) {
            this.collapseAll(b[0], b[1]);
        }
        return good;
    }

    collapseAll(x, y) {
        var visited = new Map;
        var later = [];
        var failed = false;
        later.push([x, y]);
        do {
            var a = later[0];
            if (!visited.get(`${a[0]}, ${a[1]}`)) {

                let t = 0;
            var co = this.collapseTile(a[0], a[1]);
            if (!co) {
                later.shift();
                continue;
            } 
            let o = co.later;
            visited.set(`${a[0]}, ${a[1]}`, true);
                for (const point of o) {
                    if (visited.get(`${point[0]}, ${point[1]}`)) continue;
                    later.push(point);
                }
            later.shift();
            } else later.shift();
        } while (later.length > 0);
    }
    collapseBiomeTile(x, y, biome) {
        let tile = n0grid.get(`${x}, ${y}`)
        var rules = biome.tiles
        if (rules != null) {
        if (!tile) {
           tile = {tile: new Cell(rules), biome}
            n0grid.set(`${x}, ${y}`, tile)
        }
        }
        var myOptions = tile.tile.options.slice();

        let later = []
        checkDir(x, y - 1, (a, b) => n0tiles.get(a).isUp(n0tiles.get(b.option)))
        checkDir(x + 1, y, (a, b) => n0tiles.get(a).isRight(n0tiles.get(b.option)))
        checkDir(x, y + 1, (a, b) => n0tiles.get(a).isDown(n0tiles.get(b.option)))
        checkDir(x - 1, y, (a, b) => n0tiles.get(a).isLeft(n0tiles.get(b.option)))
        tile.tile.option = this.weightedRandom(myOptions);

        return { later, option:  tile.tile.option };
        function checkDir(x, y, conditionFunc) {
            var b = n0grid.get(`${x}, ${y}`)?.tile;
            if (b == null) return;
            if (b.option != null)
                myOptions = myOptions.filter(a => conditionFunc(a, b));
            else later.push([x, y]);
        }
    }
    collapseTile(x, y, rules) {
        let tile = n0grid.get(`${x}, ${y}`)
        if (rules != null) //if we pipe in rules we make new tile
        if (!tile) {
            tile = {tile: new Cell(rules)}
            n0grid.set(`${x}, ${y}`, tile)
        }
        if (!tile) return null;
        var myOptions = tile.tile.options.slice();

        let later = []
        checkDir(x, y - 1, (a, b) => n0tiles.get(a).isUp(n0tiles.get(b.option)))
        checkDir(x + 1, y, (a, b) => n0tiles.get(a).isRight(n0tiles.get(b.option)))
        checkDir(x, y + 1, (a, b) => n0tiles.get(a).isDown(n0tiles.get(b.option)))
        checkDir(x - 1, y, (a, b) => n0tiles.get(a).isLeft(n0tiles.get(b.option)))
        tile.tile.option = this.weightedRandom(myOptions);

        return { later, option: tile.tile.option };
        function checkDir(x, y, conditionFunc) {
            var b = n0grid.get(`${x}, ${y}`);
            if (b == null) return;
            b= b.tile;
            if (b.option != null)
                myOptions = myOptions.filter(a => conditionFunc(a, b));
            else later.push([x, y]);
        }
    }

    drawTile(i, o, draw) {
        let index = `${i}, ${o}`;
        let cell = n0grid.get(index);
        if (cell && typeof cell.tile.option === 'string') {
            var img = n0tiles.get(cell.tile.option).img
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