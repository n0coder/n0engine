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
let cursor = new DebugCursor()


let editorState = "add", state = "add";
let selectedPos = null;
let selectedTile = null, editingTile = null;


let states = new Map();


let tilesetWindow = {
    x: 512 - 64, y: 64, w: 512 - 128, h: 512 - 128,
    state: "tileset", grid: new WorldGrid(16, 4),
    selectedPos: null,
    draw() {
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
    },
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

            p.ellipse(32, 32, 32);
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
            var sides = [t.up, t.right, t.down, t.left];
            let drawSide = (i) => {

                let data = sides[i];
                p.fill(255)
                //p.ellipse(xx+(x*size),yy+(y*size), 8);
                p.text(data[0], xx + (x * size), yy + (y * size))
                p.text(data[1], xx + (x2 * size), yy + (y2 * size))
                p.text(data[2], xx + (x3 * size), yy + (y3 * size))

            }

            p.textSize(16 / 1)
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
let nano = { x: 4, y: 4, sightRadius: worldGrid.tileSize * 4 }

let visualizer = {
    draw() {
        drawChunks(nano, false);

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
let ui2 = {
    div: p.createDiv().id("tileEditor").parent(rightMenu.menu),
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
            //console.log();
            this.div.class(tile.img.cls)
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
        //rightMenu.hide();
        ui2.build(tile.n0ts.tile);

        //this.drawUI(tile);
    },
    showImg(img) {
        console.log("editing image tile data ****not implemented****");
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

        let n0t = new Tile();
        n0t.img = img;
        img.tile = n0t;
        n0t.name = img.name;

        if (gen && selectedPos) {
            let tile = worldGrid.getTile(selectedPos.x, selectedPos.y);
            tile ??= genTile(selectedPos.x, selectedPos.y, false)

            if (img.n0t !== undefined) {

                if (tile?.n0ts?.placeholder) { //if this tile has a placeholder on n0ts, destroy the n0ts
                    tile.n0ts = null;
                } else if (tile?.n0ts) { //if this tile has an n0ts but no placeholder, don't remake the tile
                    return;
                }
                //build the n0ts (build new tile or rebuild placeholder tile)
                buildn0ts(tile, ["tile"], new Map([["tile", img.n0t]]))
                return;
            }

            console.warn("creating new tile")

            buildn0ts(tile, ["tile"], new Map([["tile", n0t]]))
            tile.n0tsEditorTile = n0t;
            if (tile?.n0ts?.placeholder) {
                console.log("placeholder", tile.n0ts.placeholder);
                if (tile?.n0ts?.placeholder) {
                    tile.n0ts = null;
                }
            }
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
    }),
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