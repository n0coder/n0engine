
import Alea from "alea";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { inverseLerp, lerp } from "../../../engine/n0math/ranges.mjs";
import { Cell } from "./Cell.mjs";
export var n0grid = new Map();

document.an0FailedTiles = [];
export const n0alea = Alea("n0");
function weightedRandom(items) {
        items = items.filter(a => a != null && a.tile != null)
        var totalWeight = items.reduce((total, item) => total + (item.tile.weight + (item.bias || 0) || 1), 0);
        var random = n0alea() * totalWeight;
        var cumulativeWeight = 0;
        for (var i = 0; i < items.length; i++) {
            cumulativeWeight += items[i].tile.weight + (items[i].bias || 0) || 1;
            if (random < cumulativeWeight) {
                return items[i];
            }
        }
    }
export class n0FunctionCollapse {
    constructor(alea) {
        this.alea = alea || Math.random
    }

    blocks(size = 5, w, h, rules) {
        for (let i = 0; i <= w; i += size - 1) {
            for (let o = 0; o <= h; o += size - 1) {
                this.block(i, o, size, w, h, rules)
            }
        }

    }
    blocksBiome(x, y, w, h, size) {
        for (let i = 0; i <= w; i++) {
            for (let o = 0; o <= h; o++) {
                this.block(x + i, y + o, w, h)
            }
        }
    }
    block(i, o, w, h) {
        let good = true;
        let broken = [];


        for (let x = -1; x < 1; x++) {
            let ix = i + x;
            if (ix > i + w) break;
            for (let y = -1; y < 1; y++) {
                let oy = o + y;
                if (oy > o + h) break;
                let k = `${ix}, ${oy}`;

                var iv = n0grid.get(k)

                if (iv) {
                    if (iv.tile.option == null) {
                        let biomes = []
                        var uiv = n0grid.get(`${ix}, ${oy - 1}`)
                        if (uiv && uiv.tile.option && uiv.biome) biomes.push(uiv.biome.biome.name)
                        var riv = n0grid.get(`${ix + 1}, ${oy}`)
                        if (riv && riv.tile.option && riv.biome) biomes.push(riv.biome.biome.name)
                        var div = n0grid.get(`${ix}, ${oy + 1}`)
                        if (div && div.tile.option && div.biome) biomes.push(div.biome.biome.name)
                        var liv = n0grid.get(`${ix - 1}, ${oy}`)
                        if (liv && liv.tile.option && liv.biome) biomes.push(liv.biome.biome.name)
                        biomes = [...new Set(biomes)];
                        biomes.sort();
                        var combinations = [];
                        for (var i = 0; i < biomes.length; i++) {
                            for (var j = i + 1; j < biomes.length; j++) {
                                combinations.push(biomes[i] + "+" + biomes[j]);
                            }
                        }
                        var rules = combinations.map(c => n0jointtiles.get(c))
                        rules = rules.flat(3);
                        iv.tile = new Cell(rules)
                        broken.push([ix, oy]);
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
        var visited = new Map();
        var later = [];
        var failed = false;
        later.push([x, y]);
        do {
            var a = later[0];
            if (!visited.get(`${a[0]}, ${a[1]}`)) {

                let t = 0;
                var co = this.collapseTile(a[0], a[1]);
                if (co) {
                    if (!co.tile) {
                        console.log(a)
                    }
                    if (!co.later) {
                        later.shift();
                        continue;
                    }
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
    

    testingCheckdir() {


    }

    
    collapseBiomeTile(x, y, biome) {
        console.error("combine n0collapse into the worldgrid tile, cleaner");
       
        let tile = n0grid.get(`${x}, ${y}`)

        if (biome?.biome == null) {
            return;
        }

        var rules = biome.biome.tiles
        if (rules != null) {
            if (!tile) {
                tile = { tile: new Cell(rules), biome }
                n0grid.set(`${x}, ${y}`, tile)
            }
        }

        if (tile.tile.option) return { later, tile };
        biome.tile = tile;
        var myOptions = tile.tile.options.slice();


        for (var o of tile.tile.options) { //loop original array to find tiles to remove from copy
            var tvt = n0tiles.get(o);
            if (!tvt) continue;
            let valid = new Map();
            for (var t of tvt.thresholds) {
                var factor = biome.genCache.get(t.factor)
                if (!factor) continue; //if the factor doesn't exist don't use it
                var sum = inverseLerp(factor.minm, factor.maxm, factor.sum)
                sum = lerp(-1, 1, sum)
                valid.set(t.factor, valid.get(t.factor) || (sum > t.min && sum < t.max))
            }
            for (var [k, v] of valid) {
                if (!v) {
                    var i = myOptions.indexOf(o);
                    myOptions.splice(i, 1)
                }
            }
        }

        let later = []
        checkDir(x, y - 1, (a, b) => a.isUp(b))
        checkDir(x + 1, y, (a, b) => a.isRight(b))
        checkDir(x, y + 1, (a, b) => a.isDown(b))
        checkDir(x - 1, y, (a, b) => a.isLeft(b))
        var myOptionvs = myOptions.slice().map(o => {
            var tvt = n0tiles.get(o);
            if (!tvt) return null;
            let multiple = 1;
            for (var t of tvt.biases) {
                var factor = biome.genCache.get(t.factor)
                if (!factor) continue; //if the factor doesn't exist don't use it
                var bias = inverseLerp(factor.minm, factor.maxm, factor.sum)
                multiple *= lerp(-t.value, t.value, bias)
            }
            return { option: o, bias: multiple }
        })

        tile.tile.option = this.weightedRandom(myOptionvs);

        return { later, tile };
        function checkDir(x, y, conditionFunc) {
            var b = n0grid.get(`${x}, ${y}`)?.tile;
            if (b == null) return;
            if (b.option != null) {
                var bt = n0tiles.get(b.option);
                myOptions = myOptions.filter(a => {
                    if (a == null) return false;
                    var at = n0tiles.get(a);
                    if (at != null && bt != null)
                        return conditionFunc(at, bt)
                });
                return bt
            }
            else later.push([x, y]);
            return n0tiles.get(b.option);
        }
    }
    collapseTile(x, y, rules) {
        let tile = n0grid.get(`${x}, ${y}`)
        if (rules != null) //if we pipe in rules we make new tile
            if (!tile) {
                tile = { tile: new Cell(rules) }
                n0grid.set(`${x}, ${y}`, tile)
            }
        if (!tile) return null;
        var myOptions = tile.tile.options.slice();
        if (tile.tile.option) return tile;



        let later = []
        let upoption = checkDir(x, y - 1, (a, b) => a.isUp(b))
        let rightoption = checkDir(x + 1, y, (a, b) => a.isRight(b))
        let downoption = checkDir(x, y + 1, (a, b) => a.isDown(b))
        let leftoption = checkDir(x - 1, y, (a, b) => a.isLeft(b))

        var myOptionvs = myOptions.slice().map(o => {
            var tvt = n0tiles.get(o);
            let multiple = 1;
            if (!tvt) return null //{ option:o, bias }
            for (var t of tvt.biases) {
                var factor = tile.biome.genCache.get(t.factor)
                var bias = inverseLerp(factor.minm, factor.maxm, factor.sum)
                multiple *= lerp(-t.value, t.value, bias)
            }
            return { option: o, bias }
        })

        tile.tile.option = this.weightedRandom(myOptionvs);
        if (tile.tile.option == null) {
            let sides = []
            let count = 0

            if (upoption) {
                sides.push(upoption.down)
                count++
            } else {
                sides.push(["?,?,?"])
            }

            if (rightoption) {
                sides.push(rightoption.down)
                count++
            } else {
                sides.push(["?,?,?"])
            }

            if (downoption) {
                sides.push(downoption.down)
                count++
            } else {
                sides.push(["?,?,?"])
            }

            if (leftoption) {
                sides.push(leftoption.down)
                count++
            } else {
                sides.push(["?,?,?"])
            }

            if (count > 3) {
                var tzis = [
                    upoption?.down[0], upoption?.down[1], upoption?.down[2], rightoption?.left[1], rightoption?.left[2],
                    downoption?.up[0], downoption?.up[0], leftoption?.right[1]
                ]

                document.an0FailedTiles.push({ tzis, sides })
            }
        }

        return { later, tile };
        function checkDir(x, y, conditionFunc) {
            var b = n0grid.get(`${x}, ${y}`)?.tile;
            if (b == null) return;
            if (b.option != null) {
                var bt = n0tiles.get(b.option);
                myOptions = myOptions.filter(a => {
                    if (a == null) return false;
                    var at = n0tiles.get(a);
                    if (at != null && bt != null)
                        return conditionFunc(at, bt)
                });
                return bt
            }
            else later.push([x, y]);
            return n0tiles.get(b.option);
        }
    }

    drawTile(i, o, drawImg, drawColor) {
        let index = `${i}, ${o}`;

        if (!drawImg && !drawColor) {
            console.warn("you are trying to draw a tile without a draw function...")
        }

        let cell = n0grid.get(index);
        if (cell) {
            var img = null;
            if (typeof cell.tile.option === 'string') {
                img = n0tiles.get(cell.tile.option).img;
            }
            if (img && drawImg) {
                drawImg(cell, img);
            } else {
                var color = cell?.biome?.biome?.color;
                if (color && drawColor) {
                    drawColor(cell, color);
                }
            }
        }

    }

    
}