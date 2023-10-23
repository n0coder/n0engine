import Alea from "alea";
import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { loadImg } from "../../../engine/core/Utilities/ObjectUtils.mjs";
import { Tile } from "./Tile.mjs";
import { Cell } from "./Cell.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";

var tiles = new Map();
tiles.set('wave0', new Tile('assets/wave/0.png', [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]]))
tiles.set('wave1', new Tile('assets/wave/1.png', [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0]]))
tiles.set('wave2', new Tile('assets/wave/2.png', [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]]))
tiles.set('wave3', new Tile('assets/wave/3.png', [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]]))
tiles.set('wave4', new Tile('assets/wave/4.png', [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]]))
tiles.set('wave5', new Tile('assets/wave/5.png', [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]]))
tiles.set('wave6', new Tile('assets/wave/6.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]))

export class WaveFunctionCollapse {
    constructor(nano) {
        this.nano = nano;

        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;

        this.random = "n0fc2";
        this.alea = Alea(this.random)

        this.w = 28;
        this.h = 16;
        
        this.board = new Map();
    }
    init() {
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                let index = `${i}, ${o}`;
                let cell = this.board.get(index);
                if (!cell) {
                    //a cell can be made up of any number of possible states
                    cell = new Cell(['wave0','wave1','wave2','wave3','wave4','wave5','wave6'])
                    this.board.set(index, cell);
                }
            }
        }
        this.collapseAll(0,0)
    }

    collapseAll(x, y) {
        var visited = new Map;
        var later = [];
        later.push([x, y]);
        do {
            var a = later[0];
            if (!visited.get(`${a[0]}, ${a[1]}`)) {
            var o = this.collapse(a[0], a[1]);
            visited.set(`${a[0]}, ${a[1]}`, true);
                for (const point of o) {
                    if (visited.get(`${point[0]}, ${point[1]}`)) continue;
                    later.push(point);
                }
            later.shift();
            } else later.shift();
        } while (later.length > 0);
    }
    
    collapse(x,y, img) {
        var me = this.board.get(`${x}, ${y}`);
        
        var later = [];
        var myOptions = me.options.slice();
        var up = this.board.get(`${x}, ${y-1}`)
        if (up != null) {
            if (up.option != null) {
                myOptions = myOptions.filter(m=> tiles.get(m).isUp(tiles.get(up.option)))
            } else later.push([x,y-1])
        }

        var right = this.board.get(`${x+1}, ${y}`)
        if (right != null) {
            if (right.option != null) {
                myOptions = myOptions.filter(m=> tiles.get(m).isRight(tiles.get(right.option)))
            }else later.push([x+1,y])
        }
        var down = this.board.get(`${x}, ${y+1}`)
        if (down != null) {
            if (down.option != null) {
                myOptions = myOptions.filter(m=> tiles.get(m).isDown(tiles.get(down.option)))
            }else later.push([x,y+1])
        }
        var left = this.board.get(`${x-1}, ${y}`)
        if (left != null) {
            if (left.option != null) {
                myOptions = myOptions.filter(m=> tiles.get(m).isLeft(tiles.get(left.option)))
            }else later.push([x-1,y])
        }
        var rand = Math.floor(this.alea()*myOptions.length);
        me.option = myOptions[rand];
        return later;
    }

    draw() {
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                var v = worldGrid.gridBoundsScreenSpace(i, o, 1, 1);
                let index = `${i}, ${o}`;
                let cell = this.board.get(index);
                if (cell && typeof cell.option === 'string') {
                    var img = tiles.get(cell.option).img
                    if (img)
                        p.image(img, v.x,v.y, v.w,v.h)
                }
            }
        }
    }
}
