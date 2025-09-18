import { } from "../world/wave/TileMods.mjs"
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine"
import { WorldGrid, worldGrid } from "../../engine/grid/worldGrid.mjs"
import { DebugCursor } from "../world/debugCursor.mjs";
import { buildn0ts, n0TileModules } from "../world/wave/n0.mjs";
import { Tile } from "../world/wave/Tile.mjs";
import { drawChunks } from "../world/wave/worldGen/ChunkDrawer.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";
import { invdiv, n0TileEditorMenu } from "./n0tilesystem/n0tseditorUI.mjs";
import { clamp, inverseLerp } from "../../engine/n0math/ranges.mjs";
let cursor = new DebugCursor()


let editorState = "add", state = "add";
let selectedPos = null;
let selectedTile = null, editingTile = null;


let states = new Map();


let tilesetWindow = {
    x: 512 - 64, y: 64, w: 512 - 128, h: 512 - 128,
    state: "tileset", grid: new WorldGrid(16, 4),
    selectedPos: null,
    draw() {/*
        p.fill(44, 44, 44);
        p.rect(this.x, this.y, this.w, this.h)
        if (this.grid.mouseInRect(this.x, this.y, this.w, this.h)) {
            p.ellipse(this.x, this.y, 32, 32)

            let mouse = this.grid.mouseTilePos.screen()
            p.fill(255, 0, 0);
            p.rect(mouse.x, mouse.y, this.grid.tileSize, this.grid.tileSize)

            if (this.selectedPos) {
                p.fill(255, 0, 0);
                p.rect(this.selectedPos.x, this.selectedPos.y, this.grid.tileSize, this.grid.tileSize)
            }
        }
    */},
    click() {
        this.selectedPos = this.grid.mouseTilePos.screen();
        //this.camera.enabled=true;
        //this.camera.follow(this.selectedPos)
    }
}
states.set("tileset", tilesetWindow)

function editTile(tile) {
    if (tile === editingTile || tile === undefined) return;
    console.log("editing tile", tile);
    editingTile = tile;

    if (tile) ui.show(tile);
    // show ui
}
function editTileImg(img) {
    if (img === editingTile || img === undefined) return;
    console.log("editing tile", img);
    editingTile = img;

    if (img) ui.showImg(img);
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
            n0tsEditorFiles.open(true);
        } else {
            let ts = n0tsEditorTiles.list.map(t => {
                return t.n0tsEditorTile.img.shared
            });
            console.log(ts)
            let tileJson = JSON.stringify(ts)
            console.log(tileJson)

            let ideally = {
                name: "purple",
                path: "/assets/wave/purple",
                imgRules: [
                    [2, "2.png", [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]]],
                    [3, "3.png", [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]]],
                    [4, "4.png", [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]]],
                    [5, "5.png", [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]]],
                ],
                weight: .5,
                thresholds: [{ factor: "elevation", min: -1, max: 1 }],
                biases: [{ factor: "temperature", value: -1 }]
            }
            tileJson = JSON.stringify(ideally)
            console.log(tileJson)

        }
    },
    draw() {
        let mouse = worldGrid.mouseTilePos.screen();
        p.noFill();
        p.stroke(127, 127, 127)
        p.strokeWeight(.5)
        p.rect(mouse.x, mouse.y, worldGrid.tileSize, worldGrid.tileSize)

        if (selectedPos) {
            p.noFill();
            p.stroke(127, 127, 127)
            p.strokeWeight(.5)
            let tile = selectedPos.screen()
            p.rect(tile.x, tile.y, worldGrid.tileSize, worldGrid.tileSize)
        }

        /* aaaaaaaaaaaaaaaaaaaaa  */

        let tile = selectedTile, tpos = selectedPos;
        // TODO: remove this false flag or move the tech into the side module
        if (true && tile?.n0ts && !tile.n0ts.placeholder && tpos?.x == tile?.wx && tpos?.y == tile?.wy) {

            //p.ellipse(32, 32, 32);
            let size = worldGrid.tileSize / 3, hsize = size / 2, hgrid = worldGrid.tileSize / 2

            p.strokeWeight(.5)
            p.textAlign(p.CENTER, p.CENTER)

            //move to rotational style
            //so we can work on sixe vizualization tech
            let xx = tile.wx * worldGrid.tileSize + hgrid
            let yy = tile.wy * worldGrid.tileSize + hgrid


            var x = -1, y = -2.5
            var x2 = 0, y2 = y, x3 = -x, y3 = y
            let t = tile.n0ts.tile
            //var sides = [t.up, t.right, t.down, t.left];
            let drawSide = (data) => {
                p.fill(255)
                //p.ellipse(xx+(x*size),yy+(y*size), 8);
                p.text(data[0], xx + (x * size), yy + (y * size))
                p.text(data[1], xx + (x2 * size), yy + (y2 * size))
                p.text(data[2], xx + (x3 * size), yy + (y3 * size))

            }

            p.textSize(16 / 1)
            drawSide(t.up)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(t.right)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(t.down)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(t.left)

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
let nano = { x: 4, y: 4, sightRadius: worldGrid.tileSize * 4 }

let visualizer = {
    draw() {
        drawChunks(nano, true);

        tilesetWindow.draw();
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        states.get(state)?.draw?.();

    },
    hover() {
        let mouse = worldGrid.mouseTilePos.screen()
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        states.get(state)?.hover?.();
    },
    mousePressed() {
        if (!worldGrid.mouseOnScreen) return;
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        let pos = worldGrid.mouseTilePos;
        states.get(state)?.click?.(pos)
    },
    mouseDragged() {
        if (!worldGrid.mouseOnScreen) return;
        let pos = worldGrid.mouseTilePos;
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        states.get(state)?.drag?.(pos);
    },
    mouseReleased() {
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        states.get(state)?.release?.();
    },
    doubleClicked() {
        if (!worldGrid.mouseOnScreen) return;
        let inWindow = worldGrid.mouseInRect(tilesetWindow.x, tilesetWindow.y, tilesetWindow.w, tilesetWindow.h);
        if (inWindow) {
            state = tilesetWindow.state;
        } else
            state = editorState

        let pos = worldGrid.mouseTilePos;
        states.get(state).doubleClick?.(pos);
    }
}
cosmicEntityManager.addEntity(visualizer, -5)

rightMenu.show();
let timg = null;
let materials = [
    {name:"air", color: [255,255,255,255]},    
    {name:"dirt", color: [255,255,155,255]},
    {name:"grass", color: [100,255,100,255]},
    {name:"water", color: [100,100,255,255]},
    {name:"sand", color: [255,220,150,255]},
    {name:"stone", color: [200,200,200,255]},
    {name:"water", color: [100,100,255,255]},
    {name:"sand", color: [255,220,150,255]},
    {name:"stone", color: [200,200,200,255]},
    {name:"water", color: [100,100,255,255]},
    {name:"sand", color: [255,220,150,255]},
    {name:"stone", color: [200,200,200,255]},
    {name:"water", color: [100,100,255,255]},
    {name:"sand", color: [255,220,150,255]},
    {name:"stone", color: [200,200,200,255]},
    {name:"water", color: [100,100,255,255]},
    {name:"sand", color: [255,220,150,255]},
    {name:"stone", color: [200,200,200,255]},
];

let mati = 0;
let drag = undefined;   // offset at drag start
let scrollPos = 0;
let sw = 16, space = 16, sh= 24, sws = sw + space;
let lastChangeFrame = 1;
let p2 = new window.p5((p2) => {
    p2.draw = () => {
        p2.clear()
        if (timg) {
            let w = 64, w05 = w/2, w33 = w/3;
            /*
            var color = materials[timg.n0t.up[0]].color;
            if (color) p2.fill(color)
            p2.rect((p2.width/2)-w05, ((p2.height-sh)/2)-w05-w33, w33,w33);
            var color = materials[timg.n0t.up[1]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33), ((p2.height-sh)/2)-w05-w33, w33,w33);
            var color = materials[timg.n0t.up[2]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33*2), ((p2.height-sh)/2)-w05-w33, w33,w33);
        
            var color = materials[timg.n0t.right[0]].color;
            if (color) p2.fill(color)
            p2.rect((p2.width/2)-w05+(w33*3), ((p2.height-sh)/2)-w05, w33,w33);
            var color = materials[timg.n0t.right[1]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33*3), ((p2.height-sh)/2)-w05+(w33), w33,w33);
            var color = materials[timg.n0t.right[2]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33*3), ((p2.height-sh)/2)-w05+(w33*2), w33,w33);
            
            var color = materials[timg.n0t.down[2]].color;
            if (color) p2.fill(color)
            p2.rect((p2.width/2)-w05, ((p2.height-sh)/2)-w05+(w33*3), w33,w33);
            var color = materials[timg.n0t.down[1]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33), ((p2.height-sh)/2)-w05+(w33*3), w33,w33);
            var color = materials[timg.n0t.down[0]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05+(w33*2), ((p2.height-sh)/2)-w05+(w33*3), w33,w33);

            var color = materials[timg.n0t.left[2]].color;
            if (color) p2.fill(color)
            p2.rect((p2.width/2)-w05-(w33), ((p2.height-sh)/2)-w05, w33,w33);
            var color = materials[timg.n0t.left[1]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05-(w33), ((p2.height-sh)/2)-w05+(w33), w33,w33);
            var color = materials[timg.n0t.left[0]].color;
            if (color) p2.fill(color) 
            p2.rect((p2.width/2)-w05-(w33), ((p2.height-sh)/2)-w05+(w33*2), w33,w33);
            */


            if (timg && timg.n0t) {
                let w = 64, w05 = w / 2, w33 = w / 3;
                let centerX = (p2.width / 2)-w33/2;
                let centerY = ((p2.height - sh) / 2)-w33/2;
                
                var x = -1, y = -2
                var x2 = 0, y2 = y, x3 = -x, y3 = y

                // sides in clockwise order
                let sides = [timg.n0t.up, timg.n0t.right, timg.n0t.down, timg.n0t.left];
                
                let drawSide = (data) => {
                    // draw three cells for this side
                    let c0 = materials[data[0]]?.color;
                    if (c0) p2.fill(c0);
                    p2.rect(centerX + (x  * w33), centerY + (y  * w33), w33, w33);                    
                    let c1 = materials[data[1]]?.color;
                    if (c1) p2.fill(c1);
                    p2.rect(centerX + (x2 * w33), centerY + (y2 * w33), w33, w33);                    
                    let c2 = materials[data[2]]?.color;
                    if (c2) p2.fill(c2);
                    p2.rect(centerX + (x3 * w33), centerY + (y3 * w33), w33, w33);
                };

                
                drawSide(timg.n0t.up);
                [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3];
                drawSide(timg.n0t.right);
                [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3];
                drawSide(timg.n0t.down);
                [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3];
                drawSide(timg.n0t.left);
                [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3];
            }
            
            p2.image(timg, (p2.width/2)-w05, ((p2.height-sh)/2)-w05, w, w)
        }
        //p2.fill(22)
        p2.noStroke();
        //p2.rect(0, p2.height - 32, p2.width, 38)
        p2.fill(materials[mati].color)
        p2.ellipse(p2.width/2, p2.height, 8,8)
        if (p2.frameCount - lastChangeFrame < 8) {
            p2.fill(255, 255, 255, p2.map(p2.frameCount - lastChangeFrame, 0, 8, 255, 0));
            p2.ellipse(p2.width/2, p2.height, 12, 12);
        }
        scrollPos = p2.lerp(scrollPos, mati, 0.2);
        if (p2.abs(scrollPos - mati) < 0.02) scrollPos = mati; // snap when close
        //let pw = materials.length * sw + (materials.length - 1) * space;
        let centerX = p2.width / 2;
        let startX = centerX - scrollPos * sws - sw/2;

        
        for (let i = 0; i < materials.length; i++) {
            let size = inverseLerp(4, 0,  Math.abs(scrollPos-i) )
            size = Math.pow(size, .5)
            size = clamp(0, 1, size);
            const mat = materials[i];
            if (i === Math.round(scrollPos)) {
                p2.stroke(100, 255, 155);
                p2.strokeWeight(2);
                
            } else {
                p2.noStroke();
            }
            p2.fill(mat.color);
            let x = startX + i * sws; 
            p2.rect(x, p2.height - sh*size,sw*size,sw*size)
        }
    }

    p2.mouseWheel = (event) => {
        if (p2.mouseY > p2.height - sh && p2.mouseY < p2.height) {
            mati += Math.sign(event.delta);
            mati = clamp(0, materials.length-1, mati);
            
            lastChangeFrame = p2.frameCount;
        }
    };
    p2.mousePressed = () => {
        
    if (p2.mouseX > 0 && p2.mouseX < p2.width)
        if (p2.mouseY > p2.height - sh && p2.mouseY < p2.height) {
            drag = {
                startX: p2.mouseX/sws, 
                i: mati, 
                frame: p2.frameCount
            }
        }
    };
    p2.mouseDragged = () => {
        if (drag)  {
            mati = drag.i + (drag.startX-(p2.mouseX/sws));
            mati = Math.round(mati);
            mati = clamp(0, materials.length-1, mati);
            lastChangeFrame = p2.frameCount;
        }
    };
    p2.mouseReleased = () => {
        if (!drag) return;
        let frames = p2.frameCount - drag.frame
        if (frames >= 10) {
            drag = undefined;
        }  else {
    drag = undefined;
    if (p2.mouseX > 0 && p2.mouseX < p2.width)
    if (p2.mouseY > p2.height - sh && p2.mouseY < p2.height) {
        // how far from center did we click, in sws units?
        let centerX = p2.width / 2;
        let dx = p2.mouseX - centerX;
        let offset = Math.round(dx / sws);

        mati = clamp(0, materials.length - 1, mati + offset);
        
            lastChangeFrame = p2.frameCount;
    }
}
    };
});
let ui2 = {
    div: p.createDiv().id("tileEditor").parent(rightMenu.menu),
    preview: p2.createCanvas(256, 168),//.parent(invdiv),
    modules: new Map([
        //["up", {}],["right", {}],["down", {}],["left", {}],["biases", {}],["thresholds", {}], 
    ]),
    build(tile) {
        this.div.elt.tile = tile;
        var itemsa = Array.from(this.div.elt.children);
        for (const node of itemsa) {
            invdiv.elt.appendChild(node);
        }
        if (tile) {
            this.preview.parent(this.div);
            //console.log();
            this.div.class(tile.img.cls)
            timg = tile.img;
            for (const name of tile.modules) {
                let module = n0TileModules.get(name)

                module?.buildUI?.(tile)

                if (module?.div) module.div.parent(this.div);
            }
        }
    }
}


let ui = {
    currentDiv: null,
    show(tile) {
        ui2.build(tile.n0tsEditorTile);
    },
    showImg(img) {
        ui2.build(img.n0t);
    }
};
export let n0tsEditorTiles = {
    list: [],
    placeUpload: false,
    div: p.createDiv().class("tiles"),
    add(file, set) {
        let created = (img) => {
            img.name = file.name
            if (img.width > 0 && img.height > 0) {
                let tile = this.createTile(img, this.placeUpload)
                if (tile) {
                    tile.selectedPos = selectedPos;
                    tile.pos = selectedPos.screen();
                    editTile(tile)
                    this.list[this.list.length] = tile
                } else editTileImg(imgdom)

            }
        }
        let imgdom = p.createImg(file.data, '', undefined, created);
        let clicked = () => {
            let tile = this.createTile(imgdom, true)
            if (tile) {
                tile.selectedPos = selectedPos;
                tile.pos = selectedPos.screen();
                editTile(tile)
                
            } else {
                editTileImg(imgdom)
            }

        }
        imgdom.mousePressed(clicked);
        n0TileEditorMenu.addImage(imgdom, set)
        //imgdom.parent(tiles.div);
    },
    createTile(img, gen) {

        let n0t = img.n0t
        if (!n0t) { 
            n0t = new Tile();
            n0t.img = img;
            n0t.name = img.name;
            n0t.rebuildFNs = []
        }
        if (gen && selectedPos) {            
            let tile = worldGrid.getTile(selectedPos.x, selectedPos.y);
            tile ??= genTile(selectedPos.x, selectedPos.y, false)
            let build = ()=>{
                if (tile.n0ts) 
                    tile.lastN0ts = tile.n0ts;
                tile.n0ts = null;

                buildn0ts(tile, ["tile"], new Map([["tile", img.n0t]]))
                tile.n0tsEditorTile = n0t;

                //if (tile?.n0ts?.placeholder) 
                    //tile.n0ts = null;
            }
            build();
            n0t.rebuildFNs.push(build);
        }
        img.n0t = n0t;
    }
}

let tilesetdiv = p.createDiv("tileset")
leftMenu.add(tilesetdiv);
n0tsEditorTiles.div.parent(tilesetdiv);
leftMenu.show();
export let n0tsEditorFiles = {
    input: p.createFileInput((file) => {
        if (file.type.startsWith('image')) {
            n0tsEditorTiles.add(file);
        }
    }, true),
    open() {
        n0tsEditorTiles.placeUpload = true;
        this.input.elt.click();
    },
    openQuiet() {
        n0tsEditorTiles.placeUpload = false;
        this.input.elt.click();
    }
}
n0tsEditorFiles.input.hide();