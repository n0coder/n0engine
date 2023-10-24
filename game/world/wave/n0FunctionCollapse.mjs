import Alea from "alea";
import { Cell } from "./Cell.mjs";

export var tiles = new Map();
export var n0grid = new Map();

var n0alea = Alea("n0")
export function weightedRandom(items) {
    var broken = items.filter(a=>tiles.get(a)==null)
    if (broken.length > 0) {
        console.warn("these input rules do not have tiles accociated with them", broken)
        items = items.filter(a=>tiles.get(a)!=null) 
    }
    var totalWeight = items.reduce((total, item) => total + (tiles.get(item).weight || 1), 0);
    var random = n0alea() * totalWeight;
    var cumulativeWeight = 0;
    for (var i = 0; i < items.length; i++) {
        cumulativeWeight += tiles.get(items[i]).weight || 1;
        if (random < cumulativeWeight) {
            return items[i];
        }
    }
}

export function drawTile(i, o, draw) {
    let index = `${i}, ${o}`;
    let cell = n0grid.get(index);
    if (cell && typeof cell.option === 'string') {
        var img = tiles.get(cell.option).img
        if (img)
            draw(img);
    }
}

export function collapseTile(x, y, rules) {
    let tile = n0grid.get(`${x}, ${y}`)
    if (!tile) {
        tile = new Cell(rules)
        n0grid.set(`${x}, ${y}`, tile)
    }

    var myOptions = tile.options.slice();

    let later = []
    checkDir(x, y - 1, (a, b) => tiles.get(a).isUp(tiles.get(b.option)))
    checkDir(x + 1, y, (a, b) => tiles.get(a).isRight(tiles.get(b.option)))
    checkDir(x, y + 1, (a, b) => tiles.get(a).isDown(tiles.get(b.option)))
    checkDir(x - 1, y, (a, b) => tiles.get(a).isLeft(tiles.get(b.option)))
    tile.option = weightedRandom(myOptions);

    return later;
    function checkDir(x, y, conditionFunc) {
        var b = n0grid.get(`${x}, ${y}`);
        if (b == null) return;
        if (b.option != null)
            myOptions = myOptions.filter(a => conditionFunc(a, b));
        else later.push([x, y]);
    }
}
