import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { worldFactors } from "../world/FactorManager.mjs";
import { genTile } from "../world/wave/worldGen/TileBuilder.mjs";
import { createTile } from "./n0tsEditor/tiles.mjs";
import { DebugCursor } from "../world/debugCursor.mjs";

export let tile = null, tpos = null;
export let tiles = [], edges = []
let mc = new DebugCursor();
worldGrid.gridSize=16
worldGrid.x= 227210
worldGrid.y= 117111

class n0tsEditor {
    constructor(){
        this.setActive = setActive, this.renderOrder = -5;
        this.setActive(true)
        this.state = "add"
        this.scale = 1;

    }
    draw(){
        var { x, y } =worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale).screen()
        //p.scale(this.scale)
        for (const [_, t] of worldGrid.tiles) {
            var {wfc,n0ts, biome, pos}=t
            if (biome) {
                let color = biome.colorsugar(t)
                p.fill(color);
                p.rect(pos.x, pos.y, worldGrid.gridSize, worldGrid.gridSize)
            }
            if (wfc) {
                p.image(wfc.img, pos.x, pos.y)
            }
            if (n0ts) {
                let i = n0ts?.tile?.img
                if(i) {
                p.image(i, pos.x, pos.y-i.height+worldGrid.gridSize)
                }
            }
        }

        p.noFill();
        p.stroke(127,127,127)
        p.strokeWeight(.5)
        p.rect(x,y, worldGrid.gridSize, worldGrid.gridSize)


        if (tpos) {
            p.noFill();
            p.stroke(191, 191, 191)
            let tposs= tpos.screen()
            p.rect(tposs.x,tposs.y, worldGrid.gridSize, worldGrid.gridSize)
        }
        p.stroke(255, 255, 255)
            p.strokeWeight(.5)
        if (tile?.wfc) {

            p.noFill();

            

            p.rect(tile.pos.x, tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)



        }
        if (this.state==="add")
        if (tile?.wfc && tpos?.x == tile?.wx && tpos?.y == tile?.wy) {
            let size = worldGrid.gridSize / 3, hsize = size / 2, hgrid = worldGrid.gridSize / 2

            p.strokeWeight(.5)
            p.textAlign(p.CENTER, p.CENTER)
            

            //move to rotational style
            //so we can work on sixe vizualization tech

            var x = -size, y = -size * 2.5
            var x2 = 0, y2 = y, x3 = -x, y3 = y

            let drawSide = (i) => {
                var side = tile.wfc.shared.sides[i]
                p.fill(side.protected ? 255 : 127)
                p.text(side.get()[0], tile.pos.x + hgrid + x, tile.pos.y + hgrid + y)
                p.text(side.get()[1], tile.pos.x + hgrid + x2, tile.pos.y + hgrid + y2)
                p.text(side.get()[2], tile.pos.x + hgrid + x3, tile.pos.y + hgrid + y3)
                
            }

            p.textSize(16/this.scale)
            drawSide(0)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(1)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(2)
            var [x, y, x2, y2, x3, y3] = [-y, x, -y2, x2, -y3, x3]
            drawSide(3)
        
        
        }
    }
    mousePressed() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let { x, y } = tpos = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale);
            let wtile = worldGrid.getTile(x, y);

            if (this.state === "add") {
                if (wtile) setTile(wtile);
            }

            if (this.state === "paint" && tpos) {
                this.isPainting = true; // Start painting
                this.paintTile(tpos.x, tpos.y); // Paint immediately on click
            }
        }
    }

    mouseDragged() {
        if (this.state === "paint" && this.isPainting) {
            let { x, y } = tpos = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale);
            let wtile = worldGrid.getTile(x, y);
            if (!wtile) { // Only paint if there's no tile already
                this.paintTile(x, y);
            }
        }
    }

    mouseReleased() {
        if (this.state === "paint") {
            this.isPainting = false; // Stop painting when mouse is released
        }
    }

    paintTile(x, y) {
        let ti = genTile(x, y);
        ti.pos = worldGrid.gridToScreenPoint(x, y);
    }

    doubleClicked(){
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let { x, y } = tpos = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale)

        let wtile = worldGrid.getTile(x,y)
        if(this.state ==="add")
        if (!wtile) {
            placeUpload = true
            fileInput.elt.click();
        } else {

            let ts = tiles.map(t => {
                return t.wfc.shared
            });
            console.log(ts)
            let tileJson = JSON.stringify(ts)
            console.log(tileJson)
            }
        }

    }
}


let tilesDiv = p.createDiv().class("tiles")
leftMenu.add(tilesDiv)
let placeUpload = false;
let fileInput =  p.createFileInput((file)=>{
    if (file.type.startsWith('image')) {
        let imgdom = p.createImg(file.data,'', undefined, (img) => {
            img.name = file.name
            if (img.width > 0 && img.height > 0) {
                let ti =createTile(img, placeUpload)
                if (ti == null) {
                    console.error('Tile does not fit');
                    return;
                }
                if (placeUpload) {
                    ti.tpos = tpos;
                    ti.pos =tpos.screen();
                    setTile(ti)
                }
                tiles[tiles.length] = ti
            } else {
                console.error('Failed to load image');
            }
        });
        imgdom.mousePressed(() => {
            let ti = createTile(imgdom, true)
            
            ti.tpos = tpos;
            ti.pos =tpos.screen();
            setTile(ti)
            
        });
        imgdom.parent(tilesDiv)
        leftMenu.show()
    }
    if (placeUpload)
    setTile(null);
}, true);
fileInput.hide();

let upload = p.createButton("uploadTiles").mousePressed(() => {
    placeUpload = false
    fileInput.elt.click();
}).parent(tilesDiv)

let tileUi=null;
/*
let divi = p.createDiv().class("factorEditor")
        leftMenu.add(divi)
        for (const [factorKey, worldFactor] of worldFactors) {
            let factorDiv = p.createDiv(factorKey).class("factor").parent(divi)
        }
*/

function setTile(t) {
    if (tile == t) return;
    tile=t
    drawUI(t)
}
function drawUI(t) {
    if (t) { rightMenu.show() } else { rightMenu.hide() }
    tileUi?.remove(); //destroy tileui
    tileUi = p.createDiv(); //make it again
    tileUi.id("test2");
    rightMenu.add(tileUi);
    if (!tile?.wfc) return;
    let wfc = tile.wfc
    let i = 0
    if (wfc.shared.sides) {
        var div = p.createDiv().parent(tileUi)
        var title = p.createDiv("title").parent(div)
        p.createSpan("Top").parent(title);
        sideUI(wfc.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        var title = p.createDiv("title").parent(div) 
        p.createSpan("Right").parent(title);
        sideUI(wfc.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        var title = p.createDiv("title").parent(div)
        p.createSpan("Bottom").parent(title);
        sideUI(wfc.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        var title = p.createDiv("title").parent(div)
        p.createSpan("Left").parent(title);
        sideUI(wfc.shared.sides[i++], div);
    }
    
    var div = p.createDiv().parent(tileUi)
    let input = p.createInput('number').class("sidebit").parent(div).value(wfc.shared.weight);
        input.input(() => {
            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            wfc.shared.weight = a;
        });

    biasesUI(wfc.shared, tileUi);
    thresholdsUI(wfc.shared, tileUi);
}
let editor = new n0tsEditor()

function biasesUI(tile, div) {
    let biases = tile.biases;
    let biasesDiv = p.createDiv().parent(div);
    for (let i = 0; i < biases.length; i++) {
        let bias = biases[i];
        let biasDiv = p.createDiv().parent(biasesDiv);
        // factor title 
        //p.createSpan(bias.factor).parent(biasDiv);
        //select box for world factors
        let select = p.createSelect().parent(biasDiv).class("buttonbit");
        for (const [factorKey, worldFactor] of worldFactors) {
            //exclude factors that are used in biases
            select.option(factorKey);
        }
        select.selected(bias.factor);
        select.changed(() => {
            bias.factor = select.value();
            drawUI(tile)
        });
        //input for value
        let input = p.createInput('number').parent(biasDiv).value(bias.value).class("sidebit");
        input.input(() => {
            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            bias.value = a;
        });
        //remove button
        let removeBias = p.createButton("X").parent(biasDiv).class("buttonbit");
        removeBias.mousePressed(() => {
            biases.splice(i, 1);
            drawUI(tile);
        });
    }
    //add new factor button
    let addBias = p.createButton("Add Bias").parent(biasesDiv).class("buttonbit");
    addBias.mousePressed(() => {

        //default to a bias that was not used
        for (const [factorKey, worldFactor] of worldFactors) {
            //exclude factors that are used in biases
            if (biases.find(b => b.factor === factorKey)) continue;
        biases.push({ factor: factorKey, value: 0 });
        drawUI(tile);
        break;
        }
    });
}
function thresholdsUI(tile, div) {
    let thresholds = tile.thresholds;
    let thresholdsDiv = p.createDiv().parent(div);
    for (let i = 0; i < thresholds.length; i++) {
        let thresh = thresholds[i];
        let threshDiv = p.createDiv().parent(thresholdsDiv);

        let select = p.createSelect().parent(threshDiv).class("buttonbit");
        for (const [factorKey, worldFactor] of worldFactors) {
            //exclude factors that are used in biases
            select.option(factorKey);
        }
        select.selected(thresh.factor);
        select.changed(() => {
            let f = worldFactors.get(select.value())
            thresh.min = f.mini;
            thresh.max = f.maxi;
            thresh.factor = select.value();
            drawUI(tile)
        });
        //input for value
        let min = p.createInput('number').parent(threshDiv).value(thresh.min).class("sidebit");
        min.input(() => {
            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            bias.min = a;
        });
        //input for value
        let max = p.createInput('number').parent(threshDiv).value(thresh.max).class("sidebit");
        max.input(() => {
            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            bias.max = a;
        });
        //remove button
        let removeThreshold = p.createButton("X").parent(threshDiv).class("buttonbit");
        removeThreshold.mousePressed(() => {
            thresholds.splice(i, 1);
            drawUI(tile);
        });
    }
    let addThreshold = p.createButton("Add Threshold").parent(thresholdsDiv).class("buttonbit");
    addThreshold.mousePressed(() => {
        for (const [factorKey, worldFactor] of worldFactors) {
            if (thresholds.find(b => b.factor === factorKey)) continue;
            console.log(factorKey, worldFactor)
            thresholds.push({ factor: factorKey, min: worldFactor.mini, max: worldFactor.maxi });
            drawUI(tile);
            break;
        }
    });
}

export function sideUI(side, div, reverse = false) {
    let si = side.get(reverse);
    
    for (let i = 0; i < si.length; i++) {
        let s = si[i];
        let input = p.createInput('number').class("sidebit").parent(div).value(s);
        input.input(() => {

            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            si[i] = a;
            side.set(si);
        });
        
    }
    
}
