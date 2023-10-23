import Alea from "alea";
import { setActive } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../../engine/core/p5engine.mjs";
import { worldGrid } from "../../../engine/grid/worldGrid.mjs";

export class NanoFunctionCollapse {
    constructor(nano) {
        this.nano = nano;

        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;

        this.random = "n0fc";
        this.alea = Alea(this.random)

        this.w = 28;
        this.h = 16;
        this.rules = {
            0: [1,0],
            1: [0,1,2],
            2: [2,1]
        }
        this.colors = [
            [45], [145], [222]
        ];
        this.board = this.init() 
        /*
        let fla = this.board.flat(4);
        while (fla.length > 0) {
            var r = fla.splice(Math.floor(this.alea()*fla.length),1)
            this.nano.brain.do("harvest",r[0])
        }
        console.log(this.nano.brain)
        */
        this.nano.brain.do("harvest",this.board[0][2])
        this.nano.brain.doLater("harvest", function (q) { return Array.isArray(q.choices)},this.board[0][2])
        this.nano.brain.do("debug", this.board[0][0])
    }
    init() {
        let board = []
        for (let i = 0; i < this.w; i++) {
            board[i] = []
            for (let o = 0; o < this.h; o++) {
                let {x,y} = worldGrid.gridToScreenPoint(i,o);
                board[i][o] = {
                    x:x+worldGrid.halfTileSize, i,
                    y:y+worldGrid.halfTileSize, o,
                    choices: [0,1,2], ns: [], rules:this.rules, alea:this.alea,
                    harvest: function(nano) {
                        if (!Array.isArray(this.choices)) return false;
                        var choice = this.choices[Math.floor(this.alea()*this.choices.length)]
                        this.choices = choice
                        for (const n of this.ns) {
                            if (Array.isArray(n.choices)){
                                for (let r = n.choices.length-1; r >= 0; r--) {
                                    if (!this.rules[n.choices[r]].includes(choice))
                                        n.choices.splice(r,1)                                    
                                }
                            }
                        } 
                        var n = this.ns.filter(o=>( Array.isArray(o.choices) ))
                        
                        var an = Math.floor(this.alea()*n.length);
                        for (let io = 0; io < n.length; io++) {
                            if (an === io) nano.brain.do("harvest",n[an])
                            else {
                                nano.brain.doLater("harvest", function(c) {return Array.isArray(c.choices)}, n[io])
                                n[io].marked = true;
                            }
                        }

                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                addNeighbors(this.w, this.h, i, o, -1, 0);
                addNeighbors(this.w, this.h, i, o, 0, -1);
                addNeighbors(this.w, this.h, i, o, 1, 0);
                addNeighbors(this.w, this.h, i, o, 0, 1);
            }
        }
        return board;

        function addNeighbors(w,h,i,o,vi, vo) {
            var vx = (vi + i), vy = (vo + o);
            if (vx >= 0 && vx < w && vy >= 0 && vy < h)
                board[i][o].ns.push(board[vx][vy]);
        }
    }

    draw() {
        var po =worldGrid.screenToGridPoint(this.nano.x, this.nano.y);
        
        for (let i = 0; i < this.w; i++) {
            for (let o = 0; o < this.h; o++) {
                this.drawTile(i, o, this.board[i][o]);
            }
        }
    }
    drawTile(x=0, y=0, tile) {
        var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1);
        if (typeof tile.choices === 'number') {
            p.fill(this.colors[tile.choices])
            p.rect(v.x,v.y, v.w,v.h)
        } else if (tile.marked ) {
            p.fill(255)
            p.ellipse(v.x+(v.w/2), v.y+(v.h/2), v.w/2, v.h/2)
        }
    }
}