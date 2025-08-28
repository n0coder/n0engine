

//n0ts.

import { Camera } from "../../engine/core/Camera/camera.mjs";
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine"
import { WorldGrid, worldGrid } from "../../engine/grid/worldGrid.mjs"
//import { j1, ui as oio } from "../tests/UItechs.mjs";
import { DebugCursor } from "../world/debugCursor.mjs";
import { worldFactors } from "../world/FactorManager.mjs";
import { buildn0ts, n0TileModules } from "../world/wave/n0.mjs";
import { Tile } from "../world/wave/Tile.mjs";
import { drawChunks } from "../world/wave/worldGen/ChunkDrawer.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";
import { invdiv, n0TileEditorMenu } from "./n0tilesystem/n0tseditorUI.mjs";
let cursor = new DebugCursor()

/* 

function addTiles(def) {
    for (let i = 0; i < def.imgRules.length; i++) {
        let [index, file, sides] = def.imgRules[i];
        let n0tile = new Tile(`${def.path}/${file}`, def.name);
        n0tile.setSides(sides)
        n0tile.setWeight(def.weight);
        n0tile.addThresholds(def.thresholds);
        n0tile.addBiases(def.biases);
        if (def.map)
            def.map.set(`${def.name}${index}`, n0tile)
        else
            n0tiles.set(`${def.name}${index}`, n0tile)
        
    }
}
    sssss

addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]],
        [3, "3.png", [[0,0,0],[0,0,0],[0,1,0],[0,1,0]]],
        [4, "4.png", [[0,1,0],[0,1,0],[0,0,0],[0,0,0]]],
        [5, "5.png", [[0,0,0],[0,1,0],[0,1,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: -1}]
})

*/

let editorState = "add", state = "add";
let selectedPos = null;
let selectedTile = null, editingTile = null;


let states = new Map();


let tilesetWindow = {
    x:512-64, y:64, w: 512-128, h: 512-128,
    state: "tileset", grid: new WorldGrid(16, 4),
    selectedPos:null,
    draw() {
        p.fill(44,44,44);
        p.rect(this.x, this.y, this.w, this.h)
        if (this.grid.mouseInRect(this.x,this.y,this.w,this.h)) {
            p.ellipse(this.x, this.y, 32, 32)

            let mouse = this.grid.mouseTilePos.screen()
            p.fill(255, 0,0);
            p.rect(mouse.x, mouse.y, this.grid.tileSize, this.grid.tileSize)

            if (this.selectedPos) {
                p.fill(255, 0,0);
                p.rect(this.selectedPos.x, this.selectedPos.y, this.grid.tileSize, this.grid.tileSize)
            }
        }
    },
    click(){
        this.selectedPos = this.grid.mouseTilePos.screen();
        //this.camera.enabled=true;
        //this.camera.follow(this.selectedPos)
    }
}
states.set("tileset", tilesetWindow)

function editTile (tile) {
    if (tile === editingTile || tile === undefined ) return;
    console.log("editing tile", tile);
    editingTile = tile;

    if (tile) ui.show(tile);
    // show ui
}


states.set("add", {
    click(pos) {
        
        selectedPos = pos;
        selectedTile = worldGrid.getTile(pos.x, pos.y);
        editTile(selectedTile);
    },
    doubleClick(pos) {
        let wtile = worldGrid.getTile(pos.x, pos.y)
        if (!wtile) {
            //placeUpload = true
            files.open(true);
        } else {
            let ts = tiles.list.map(t => {
                return t.n0tsEditorTile.img.shared
            });
            console.log(ts)
            let tileJson = JSON.stringify(ts)
            console.log(tileJson)

            let ideally = {
                name: "purple",
                path: "/assets/wave/purple", 
                imgRules: [
                    [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]],
                    [3, "3.png", [[0,0,0],[0,0,0],[0,1,0],[0,1,0]]],
                    [4, "4.png", [[0,1,0],[0,1,0],[0,0,0],[0,0,0]]],
                    [5, "5.png", [[0,0,0],[0,1,0],[0,1,0],[0,0,0]]],
                ],
                weight: .5,
                thresholds: [{factor: "elevation", min: -1, max: 1}], 
                biases: [{factor: "temperature", value: -1}]
            }
            tileJson = JSON.stringify(ideally)
            console.log(tileJson)

        }
    },
    draw() {
        let mouse = worldGrid.mouseTilePos.screen();
        p.noFill();
        p.stroke(127,127,127)
        p.strokeWeight(.5)
        p.rect(mouse.x, mouse.y, worldGrid.tileSize, worldGrid.tileSize)

        if (selectedPos) {
            p.noFill();
            p.stroke(127,127,127)
            p.strokeWeight(.5)
            let tile = selectedPos.screen()
            p.rect(tile.x, tile.y, worldGrid.tileSize, worldGrid.tileSize)
        }

        /* aaaaaaaaaaaaaaaaaaaaa  */

        let tile = selectedTile, tpos = selectedPos;
        // TODO: remove this false flag or move the tech into the side module
        if ( false && tile?.n0ts && tpos?.x == tile?.wx && tpos?.y == tile?.wy) {
            
            p.ellipse(32,32,32);
            let size = worldGrid.tileSize / 3, hsize = size / 2, hgrid = worldGrid.tileSize / 2

            p.strokeWeight(.5)
            p.textAlign(p.CENTER, p.CENTER)

            //move to rotational style
            //so we can work on sixe vizualization tech
            let xx = tile.wx*worldGrid.tileSize +hgrid
            let yy = tile.wy*worldGrid.tileSize + hgrid
            

            var x = -1, y = -2.5
            var x2 = 0, y2 = y, x3 = -x, y3 = y
            
            let drawSide = (i) => {
                var side = shared.sides[i]
                let data = side.get();
                p.fill(side.protected ? 255 : 127)
                //p.ellipse(xx+(x*size),yy+(y*size), 8);
                p.text(data[0],xx+(x*size),yy+(y*size))
                p.text(data[1],xx+(x2*size),yy+(y2*size))
                p.text(data[2], xx+(x3*size),yy+(y3*size))
                
            }

            p.textSize(16/1)
            drawSide(0)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(1)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(2)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(3)
        
        
        }
    }
});

states.set("paint", {
    isPainting: false,
    paintTile() {
        let ti = genTile(selectedPos.x, selectedPos.y);
        ti.pos = selectedPos.screen();
    },
    click(pos) {
        this.isPainting = true; // Start painting
        if (pos)
        this.paintTile(pos.x, pos.y); // Paint immediately on click
    },
    drag(pos) {
        
        selectedTile = worldGrid.getTile(pos.x, pos.y);
        if (this.isPainting) {
            if (!selectedTile) {
                this.paintTile(pos.x, pos.y);
            }
        }
    }, 
    release() {
        this.isPainting = false;
    }
});
let nano = { x: 4, y:4, sightRadius: worldGrid.tileSize*4 }

let visualizer = { 
    draw(){
        drawChunks(nano, false);
        
        tilesetWindow.draw();
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow)  {
            state = tilesetWindow.state;
        } else
            state = editorState
        
        states.get(state)?.draw?.();

    },
    hover() {
        let mouse = worldGrid.mouseTilePos.screen()
        states.get(state)?.hover?.();
    },
    mousePressed() {
        if (!worldGrid.mouseOnScreen) return;
        let pos = worldGrid.mouseTilePos;
        states.get(state)?.click?.(pos)
    },
    mouseDragged() {
        if (!worldGrid.mouseOnScreen) return;
        let pos = worldGrid.mouseTilePos;
        states.get(state)?.drag?.(pos);
    },
    mouseReleased(){
        states.get(state)?.release?.();
    },
    doubleClicked() {
        if (!worldGrid.mouseOnScreen) return;        
        let pos = worldGrid.mouseTilePos;
        states.get("add").doubleClick?.(pos);
    }
}
cosmicEntityManager.addEntity(visualizer, -5)



let ui = {
    currentDiv: null, 
    show(tile) {
        //rightMenu.hide();
        ui2.build(tile.n0ts.tile);
        
        //this.drawUI(tile);
    },

    drawUI(tile) {
        if (this.currentDiv) {
            var itemsa = Array.from(this.currentDiv.elt.children);
            for (const node of itemsa) {
                invdiv.elt.appendChild(node);
            }
        }
        else {
            this.currentDiv = p.createDiv().id("tileEditor"); // create new
            rightMenu.add(this.currentDiv);
        }

        if (!tile?.n0tsEditorTile) return;
        


        if (!this.currentDiv.addModule) {
            this.currentDiv.addModule =p.createDiv().parent(this.currentDiv)
            let addbutton = p.createButton("add module").class("add").parent(this.currentDiv.addModule)
            if ( addbutton.currentFN )
                addbutton.elt.removeEventListener('click', addbutton.currentFN);
            addbutton.currentFN =()=>{
                tile.n0tsEditorTile.setSides([0,0,0],[0,0,0],[0,0,0],[0,0,0])
                this.drawUI(tile);
            }
            addbutton.elt.addEventListener('click',  addbutton.currentFN);
            
        } else {
            this.currentDiv.addModule.parent(this.currentDiv);
        }
        for (const mod of tile.n0tsEditorTile.modules) {
            let module = n0TileModules.get(mod);
            console.log(mod, mod.key, module )
            
            let modui = module.buildUI(tile);
            console.log(modui);
            modui.parent(this.currentDiv);
        }
    },
};

/*
theoretically, when we upload an image, 
that image is given side state data. 
when we place or generate a tile next to another tile, 
we want to share the side with both images. 
the new image should gather any protected side into it's implementation. 
we should not be automatically protecting sides. 
if two protected sides happen to check each other,
and they don't match we fail to place. 
which means that tile copy is not created. 
if we protect a new side, 
we need to check all copies placements and delete any copies that have two clashing protected sides. 
if up is protected (index 0), 
we check the up neighbor and it's down is protected and it's side does not match, 
this tile gets deleted. we don't delete neighbors. 
*/

let tiles = {
    list: [], 
    placeUpload: false,
    div: p.createDiv().class("tiles"),
    add(file) {
        let created = (img)=> {
            img.name = file.name
            if (img.width > 0 && img.height > 0) {
                let tile = this.createTile(img, true)

                if (tile === undefined) {
                    console.error('Tile does not fit'); // ? what
                    return;
                }

                if (this.placeUpload) {
                    tile.selectedPos = selectedPos;
                    tile.pos = selectedPos.screen();
                    editTile(tile)
                }
                this.list[this.list.length] = tile
            }
        }        
        let imgdom = p.createImg(file.data, '', undefined, created);
        let clicked = () => {
            console.log({imgdom, ti: this})
            let tile = this.createTile(imgdom, true)

            if (tile === undefined) {
                    console.error('Tile does not fit'); // ? what
                    return;
                }

            tile.selectedPos = selectedPos;
            tile.pos = selectedPos.screen();
            editTile(tile)
        }
        imgdom.mousePressed(clicked);
        n0TileEditorMenu.addImage(imgdom)
        //imgdom.parent(tiles.div);
    },
    createTile(img, gen) {

        
        //side constraints gone, this tech won't handle them directly anymore

        //let up = worldGrid.getTile(selectedPos.x, selectedPos.y - 1)
        //let right = worldGrid.getTile(selectedPos.x + 1, selectedPos.y)
        //let down = worldGrid.getTile(selectedPos.x, selectedPos.y + 1)
        //let left = worldGrid.getTile(selectedPos.x - 1, selectedPos.y)

        let tile = worldGrid.getTile(selectedPos.x, selectedPos.y);
        tile ??= gen ? genTile(selectedPos.x, selectedPos.y, false) : {}

        if (img.shared !== undefined) {
            buildn0ts(tile, ["tile"] , new Map([["tile", img]]) )
            return;
        } 
        
        //let moduls = ["up", "right", "down", "left", "noiseBiases"];
        //let modules = []
        
        let n0t = new Tile();
        n0t.img = img;
        img.tile = n0t;
        n0t.name = img.name;
        /*
        for (const key of moduls) {
            let module = n0TileModules.get(key);
            if (module)
                modules.push({ key, tile: n0tsEditorTile })    
        }
        */
        tile.n0tsEditorTile = n0t;
        
        buildn0ts(tile, ["tile"] , new Map([["tile", n0t]]) )
        if (tile.n0ts) {
            if (tile.n0ts.placeholder){
                console.log("placeholder", tile.n0ts.placeholder);
            }
            
        
        }        
        /*
        
        */

        //if(!this.createSide(n0tsEditorTile, up, 2, 0)) return null;
        //if(!this.createSide(n0tsEditorTile, right, 3, 1)) return null;
        //if(!this.createSide(n0tsEditorTile, down, 0, 2)) return null;
        //if(!this.createSide(n0tsEditorTile, left, 1, 3)) return null;
        //tile.n0tsEditorTile = n0tsEditorTile;
        return tile;
    },
    createSide(data, dir, index1, index2) {
        let n0 = data;
        let n1 = dir?.n0tsEditorTile;
        
        if (!n0.img.shared) { //if the image has no data
            n0.shared.sides[index2] = makeSide2()
            //act like this tile is the image
            if (n1?.sides?.[index1]) {  //if neighbor has data we copy it
                n0.shared.sides[index2].values = n1.sides[index1].values.slice();  
            }
            return true;
        }
        else { //if the image has data...
            n0.shared = n0.img.shared
            console.log("tile has data",n0, n1)
            if (n1?.shared?.sides?.[index1]) {
                console.log("neighbor exists");
                if (n1.shared.sides[index1].protected) {
                    console.log("tile is neighboring protected"  )
                    let n0side = n0.img.shared.sides[index2].values;
                    let n1side = n1.shared.sides[index1].values;

                    for (let s = 0; s < n0side.length; s++) {

                        let v = n0side[s] !== n1side[s];
                        console.log({v, n0side, n1side});
                        if (n0side[s] !== n1side[s]) 
                            return null;
                    }
                    return true
                }
            }
        }
        
        return true;
    }
}

let tilesetdiv = p.createDiv("tileset")
leftMenu.add(tilesetdiv);
tiles.div.parent(tilesetdiv);
leftMenu.show();

let files = {
    input: p.createFileInput((file) => {
        if (file.type.startsWith('image')) {
            tiles.add(file)
        }
    }),
    open() {
        tiles.placeUpload = true;
        this.input.elt.click();
    },
    openQuiet() {
        tiles.placeUpload = true;
        this.input.elt.click();
    }
}
files.input.hide();