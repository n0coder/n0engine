

//n0ts.

import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine"
import { worldGrid } from "../../engine/grid/worldGrid.mjs"
import { DebugCursor } from "../world/debugCursor.mjs";
import { drawChunks } from "../world/wave/worldGen/ChunkDrawer.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";

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

let selectedPos = null;
let selectedTile = null, editingTile = null;

function editTile (tile) {
    if (tile === editingTile) return;
    console.log("editing tile", tile);
    editingTile = tile;
    ui.show(tile);
    // show ui
}


let states = new Map();
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
        let mouse = worldGrid.mouseTilePos.screen()

        drawChunks(nano, false);

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
    },
    mousePressed() {
        if (!worldGrid.mouseOnScreen) return;
        let pos = worldGrid.mouseTilePos;
        states.get("add").click?.(pos)
    },
    mouseDragged() {
        if (!worldGrid.mouseOnScreen) return;
        let pos = worldGrid.mouseTilePos;
        states.get("add").drag?.(pos);
    },
    mouseReleased(){
        states.get("add").release?.();
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
        if (tile) 
            rightMenu.show();
        else
            rightMenu.hide();
        
        this.drawUI(tile);
    },

    drawUI(tile) {
        this.currentDiv?.remove(); // destroy old UI
        this.currentDiv = p.createDiv(); // create new
        this.currentDiv.id("tileEditor");
        rightMenu.add(this.currentDiv);
        
        if (!tile?.n0tsEditorTile?.img?.shared) return;
        
        let shared = tile.n0tsEditorTile.img.shared;
        this.createSidesUI(shared);
        this.createWeightUI(shared);
        this.createBiasesUI(shared);
        this.createThresholdsUI(shared);
    },

    createSidesUI(shared) {
        if (!shared.sides) return;
        
        const sideNames = ["Top", "Right", "Bottom", "Left"];
        
        for (let i = 0; i < shared.sides.length; i++) {
            let sideDiv = p.createDiv().class('textdiv').parent(this.currentDiv);
            let title = p.createDiv().class("sidebit").parent(sideDiv);
            p.createDiv(sideNames[i]).parent(title);
            this.createSideInputs(shared.sides[i], sideDiv);
        }
    },

    createSideInputs(side, parent) {
        let sideValues = side.get();
        
        for (let i = 0; i < sideValues.length; i++) {
            let input = p.createInput('number')
                .class("sidebit")
                .parent(parent)
                .value(sideValues[i]);
                
            input.input(() => {
                let value = input.value();
                if (value.length <= 0) return;
                
                let numValue = Number.parseFloat(value);
                sideValues[i] = numValue;
                side.set(sideValues);
            });
        }

        let protectedCheckbox = p.createCheckbox('', side.protected)
            .class("sidebit")
            .parent(parent);
            
        protectedCheckbox.changed(() => {
            side.protected = protectedCheckbox.checked();
        });
    },

    createWeightUI(shared) {
        let weightDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(weightDiv);
        p.createSpan("Weight").parent(title);
        
        let input = p.createInput('number')
            .class("sidebit")
            .parent(weightDiv)
            .value(shared.weight);
            
        input.input(() => {
            let value = input.value();
            if (value.length <= 0) return;
            shared.weight = Number.parseFloat(value);
        });
    },

    createBiasesUI(shared) {
        let biasesDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(biasesDiv);
        p.createSpan("Biases").parent(title);
        
        // Create bias entries
        for (let i = 0; i < shared.biases.length; i++) {
            this.createBiasEntry(shared.biases[i], biasesDiv, i, shared);
        }
        
        // Add bias button
        let addButton = p.createButton("Add Bias")
            .class("buttonbit")
            .parent(biasesDiv);
            
        addButton.mousePressed(() => {
            // Find unused factor
            for (const [factorKey, worldFactor] of worldFactors) {
                if (shared.biases.find(b => b.factor === factorKey)) continue;
                shared.biases.push({ factor: factorKey, value: 0 });
                this.drawUI(editingTile); // Refresh UI
                break;
            }
        });
    },

    createBiasEntry(bias, parent, index, shared) {
        let biasDiv = p.createDiv().parent(parent);
        
        // Factor selector
        let select = p.createSelect().class("buttonbit").parent(biasDiv);
        for (const [factorKey] of worldFactors) {
            select.option(factorKey);
        }
        select.selected(bias.factor);
        select.changed(() => {
            bias.factor = select.value();
            this.drawUI(editingTile);
        });
        
        // Value input
        let valueInput = p.createInput('number')
            .class("sidebit")
            .parent(biasDiv)
            .value(bias.value);
            
        valueInput.input(() => {
            let value = valueInput.value();
            if (value.length <= 0) return;
            bias.value = Number.parseFloat(value);
        });
        
        // Remove button
        let removeButton = p.createButton("X")
            .class("buttonbit")
            .parent(biasDiv);
            
        removeButton.mousePressed(() => {
            shared.biases.splice(index, 1);
            this.drawUI(editingTile);
        });
    },

    createThresholdsUI(shared) {
        let thresholdsDiv = p.createDiv().parent(this.currentDiv);
        let title = p.createDiv().class("title").parent(thresholdsDiv);
        p.createSpan("Thresholds").parent(title);
        
        // Create threshold entries
        for (let i = 0; i < shared.thresholds.length; i++) {
            this.createThresholdEntry(shared.thresholds[i], thresholdsDiv, i, shared);
        }
        
        // Add threshold button
        let addButton = p.createButton("Add Threshold")
            .class("buttonbit")
            .parent(thresholdsDiv);
            
        addButton.mousePressed(() => {
            // Find unused factor
            for (const [factorKey, worldFactor] of worldFactors) {
                if (shared.thresholds.find(t => t.factor === factorKey)) continue;
                shared.thresholds.push({ 
                    factor: factorKey, 
                    min: worldFactor.mini, 
                    max: worldFactor.maxi 
                });
                this.drawUI(editingTile);
                break;
            }
        });
    },

    createThresholdEntry(threshold, parent, index, shared) {
        let threshDiv = p.createDiv().parent(parent);
        
        // Factor selector
        let select = p.createSelect().class("buttonbit").parent(threshDiv);
        for (const [factorKey] of worldFactors) {
            select.option(factorKey);
        }
        select.selected(threshold.factor);
        select.changed(() => {
            let factor = worldFactors.get(select.value());
            threshold.factor = select.value();
            threshold.min = factor.mini;
            threshold.max = factor.maxi;
            this.drawUI(editingTile);
        });
        
        // Min input
        let minInput = p.createInput('number')
            .class("sidebit")
            .parent(threshDiv)
            .value(threshold.min);
            
        minInput.input(() => {
            let value = minInput.value();
            if (value.length <= 0) return;
            threshold.min = Number.parseFloat(value);
        });
        
        // Max input  
        let maxInput = p.createInput('number')
            .class("sidebit")
            .parent(threshDiv)
            .value(threshold.max);
            
        maxInput.input(() => {
            let value = maxInput.value();
            if (value.length <= 0) return;
            threshold.max = Number.parseFloat(value);
        });
        
        // Remove button
        let removeButton = p.createButton("X")
            .class("buttonbit")
            .parent(threshDiv);
            
        removeButton.mousePressed(() => {
            shared.thresholds.splice(index, 1);
            this.drawUI(editingTile);
        });
    }
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
        imgdom.parent(tiles.div);
    },
    createTile(img, gen) {
        let up = worldGrid.getTile(selectedPos.x, selectedPos.y - 1)
        let right = worldGrid.getTile(selectedPos.x + 1, selectedPos.y)
        let down = worldGrid.getTile(selectedPos.x, selectedPos.y + 1)
        let left = worldGrid.getTile(selectedPos.x - 1, selectedPos.y)

        let tile = worldGrid.getTile(selectedPos.x, selectedPos.y);
        tile ??= gen ? genTile(selectedPos.x, selectedPos.y, false) : {}
        
        //tile.n0tsEditorTile = 
        console.log ("up")

        let n0tsEditorTile = {
            img,
            shared: {
            name: img.name,
            sides: [],
            weight: img.weight||1, 
            biases: img.biases||[], 
            thresholds: img.thresholds||[],
            }
        };

        if(!this.createSide(n0tsEditorTile, up, 2, 0)) return null;
        console.log("right")
        if(!this.createSide(n0tsEditorTile, right, 3, 1)) return null;
        console.log("down")
        if(!this.createSide(n0tsEditorTile, down, 0, 2)) return null;
        console.log("left")
        if(!this.createSide(n0tsEditorTile, left, 1, 3)) return null;
        tile.n0tsEditorTile = n0tsEditorTile;
        if (!img.shared) img.shared = n0tsEditorTile.shared;
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
        function makeSide2() {
            return {
                values: [0, 0, 0],
                protected: false,
                set(values) {
                    this.values = values;
                },
                get() {
                    return this.values;
                }
            };
        }
    }
}
leftMenu.add(tiles.div);

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