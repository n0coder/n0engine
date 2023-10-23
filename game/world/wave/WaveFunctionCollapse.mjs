import Alea from "alea";
import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { loadImg } from "../../../engine/core/Utilities/ObjectUtils.mjs";
import { Tile } from "./Tile.mjs";
import { Cell } from "./Cell.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";
import { p } from "../../../engine/core/p5engine.mjs";

var tiles = new Map();
tiles.set('purple0', new Tile('assets/wave/purple/0.png', [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]]))
tiles.set('purple1', new Tile('assets/wave/purple/1.png', [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0]]))
tiles.set('purple2', new Tile('assets/wave/purple/2.png', [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]]))
tiles.set('purple3', new Tile('assets/wave/purple/3.png', [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]]))
tiles.set('purple4', new Tile('assets/wave/purple/4.png', [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]]))
tiles.set('purple5', new Tile('assets/wave/purple/5.png', [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]]))
tiles.set('purple6', new Tile('assets/wave/purple/6.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 2))

tiles.set('green0', new Tile('assets/wave/green/0.png', [[2, 2, 2], [2, 3, 2], [2, 2, 2], [2, 3, 2]]))
tiles.set('green1', new Tile('assets/wave/green/1.png', [[2, 3, 2], [2, 2, 2], [2, 3, 2], [2, 2, 2]]))
tiles.set('green2', new Tile('assets/wave/green/2.png', [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]]))
tiles.set('green3', new Tile('assets/wave/green/3.png', [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]]))
tiles.set('green4', new Tile('assets/wave/green/4.png', [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]]))
tiles.set('green5', new Tile('assets/wave/green/5.png', [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]]))
tiles.set('green6', new Tile('assets/wave/green/6.png', [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]],1))

tiles.set('greenpurple0', new Tile('assets/wave/greenpurple/0.png', [[0, 4, 2], [2, 4, 0], [0,0,0], [0,0,0]],.25))
tiles.set('greenpurple1', new Tile('assets/wave/greenpurple/1.png', [[2, 4, 0], [0,0,0], [0,0,0], [0,4,2]],.25))
tiles.set('greenpurple2', new Tile('assets/wave/greenpurple/2.png', [[0,0,0], [0,0,0], [0,4,2], [2, 4, 0]],.25))
tiles.set('greenpurple3', new Tile('assets/wave/greenpurple/3.png', [[0,0,0], [0, 4, 2], [2, 4, 0], [0,0,0]],.25))

tiles.set('greenpurple4', new Tile('assets/wave/greenpurple/4.png', [[0, 4, 2], [2,2,2], [2, 4, 0], [0,0,0]],.25))
tiles.set('greenpurple5', new Tile('assets/wave/greenpurple/5.png', [[2, 2, 2], [2, 4, 0], [0,0,0], [0, 4, 2]],.25))
tiles.set('greenpurple6', new Tile('assets/wave/greenpurple/6.png', [[2, 4, 0], [0,0,0], [0, 4, 2], [2,2,2]],.25))
tiles.set('greenpurple7', new Tile('assets/wave/greenpurple/7.png', [[0,0,0], [0, 4, 2], [2, 2, 2], [2, 4, 0]],.25))

tiles.set('greenpurple8', new Tile('assets/wave/greenpurple/8.png', [[2, 4, 0], [0,1,0], [0, 4, 2], [2, 3, 2]],.25))
tiles.set('greenpurple9', new Tile('assets/wave/greenpurple/9.png', [[0,1,0], [0, 4, 2], [2, 3, 2], [2, 4, 0]],.25))
tiles.set('greenpurple10', new Tile('assets/wave/greenpurple/10.png', [[0, 4, 2], [2, 3, 2], [2, 4, 0], [0, 1, 0]],.25))
tiles.set('greenpurple11', new Tile('assets/wave/greenpurple/11.png', [[2, 3, 2], [2, 4, 0], [0,1,0], [0,4,2]],.25))
2

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
                    cell = new Cell([
                        'green2','green3','green4','green5','green6',
                        'purple0','purple1','purple2','purple3','purple4','purple5','purple6',
                        'greenpurple0','greenpurple1','greenpurple2','greenpurple3','greenpurple4',
                        'greenpurple5','greenpurple6','greenpurple7','greenpurple8','greenpurple9',
                        'greenpurple10','greenpurple11'
                ])
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
    
    
    collapse(x,y) {
        var me = this.board.get(`${x}, ${y}`);
        
        var later = [];
        var myOptions = me.options.slice();

        //these 4 lines are equal to
        checkDir(this.board, x,y-1, (a,b)=>tiles.get(a).isUp(tiles.get(b.option)))
        checkDir(this.board,x+1,y, (a,b)=>tiles.get(a).isRight(tiles.get(b.option)))
        checkDir(this.board,x,y+1, (a,b)=>tiles.get(a).isDown(tiles.get(b.option)))
        checkDir(this.board,x-1,y, (a,b)=>tiles.get(a).isLeft(tiles.get(b.option)))
        
        //var rand = Math.floor(this.alea()*myOptions.length);
        me.option = this.weightedRandom(myOptions);
        return later;

        function checkDir(board, x, y, conditionFunc) {
            var b = board.get(`${x}, ${y}`);
            if (b == null) return;
            if (b.option != null) 
                myOptions = myOptions.filter(a => conditionFunc(a, b));
             else later.push([x,y]);
        }
    }
    weightedRandom(items) {
        var totalWeight = 0;
        var weights = [];
    
        // Calculate total weight and store weights in an array
        for (var i = 0; i < items.length; i++) {
            totalWeight += tiles.get(items[i]).weight != null ? tiles.get(items[i]).weight : 1;
            weights.push(totalWeight);
        }
        // Generate a random number between 0 and total weight
        var random = this.alea() * totalWeight;
    
        // Find the object that corresponds to the random number
        for (var i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
                return items[i];
            }
        }
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
