import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";



let tile = null, tpos=null;
let tiles = [], edges = []

worldGrid.gridSize=32
class n0fcEditor {
    constructor(){
       this.setActive = setActive, this.renderOrder = -5;
       this.setActive(true)
       this.state = "add"
       this.scale = 2;

    }
    draw(){
        var { x, y } = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale).screen()
        p.scale(2)
        for (const [_, {tile, pos}] of worldGrid.tiles) {
            if(tile){
                p.image(tile.img, pos.x, pos.y)
            }
        }

        p.noFill();
        p.stroke(127,127,127)
        p.rect(x,y, worldGrid.gridSize, worldGrid.gridSize)

        if (tpos) {
            p.noFill();
            p.stroke(191, 191, 191)
            let tposs= tpos.screen()
            p.rect(tposs.x,tposs.y, worldGrid.gridSize, worldGrid.gridSize)
        }
        if (tile?.tile) {

            p.noFill();

            p.stroke(255, 255, 255)
            p.strokeWeight(.5)
            p.rect(tile.pos.x,tile.pos.y, worldGrid.gridSize, worldGrid.gridSize)



        }
        if (tile?.tile && tpos?.x == tile.tpos?.x && tpos?.y == tile?.tpos.y) {
            let size = worldGrid.gridSize / 3, hsize = size / 2

            p.strokeWeight(.5)
            p.textAlign(p.CENTER, p.CENTER)
            
            var side = tile.tile.shared.sides[0].get()
            p.text(side[0], tile.pos.x + hsize, tile.pos.y - size)
            p.text(side[1], tile.pos.x + size + hsize, tile.pos.y - size)
            p.text(side[2], tile.pos.x + size * 2 + hsize, tile.pos.y - size)
            var side = tile.tile.shared.sides[1].get()
            p.text(side[0], tile.pos.x + size * 4, tile.pos.y + hsize)
            p.text(side[1], tile.pos.x + size * 4, tile.pos.y + size + hsize)
            p.text(side[2], tile.pos.x + size * 4, tile.pos.y + size * 2 + hsize)
            var side = tile.tile.shared.sides[2].get()
            p.text(side[0], tile.pos.x + hsize, tile.pos.y + size * 4)
            p.text(side[1], tile.pos.x + size + hsize, tile.pos.y + size * 4)
            p.text(side[2], tile.pos.x + size * 2 + hsize, tile.pos.y + size * 4)
            var side = tile.tile.shared.sides[3].get()
            p.text(side[0], tile.pos.x - size, tile.pos.y + hsize)
            p.text(side[1], tile.pos.x - size, tile.pos.y + size + hsize)
            p.text(side[2], tile.pos.x - size, tile.pos.y + size * 2 + hsize)
        
        
        }
    }
    mousePressed() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let { x, y } = tpos = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale)
        let wtile = worldGrid.getTile(x,y)
        if(wtile) setTile(wtile);
        }
    }
    doubleClicked(){
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let { x, y } = tpos = worldGrid.screenToGridPoint(p.mouseX / this.scale, p.mouseY / this.scale)

        let wtile = worldGrid.getTile(x,y)
        if (!wtile) {
            fileInput.elt.click();
        } else {

            let ts = tiles.map(t => {
                return t.shared
            });
            console.log(ts)
            let tileJson = JSON.stringify(ts)
            console.log(tileJson)
            }
        }

    }
}

function initTile(img) {
    return {
        img,
        shared: {
        sides: [],
        weight: img.weight||1, 
        biases: img.biases||[], 
        thresholds: img.thresholds||[],
        }
    };
}

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
function createTile(img){
    let up = worldGrid.getTile(tpos.x, tpos.y - 1)?.tile
    let right = worldGrid.getTile(tpos.x + 1, tpos.y)?.tile
    let down = worldGrid.getTile(tpos.x, tpos.y + 1)?.tile
    let left = worldGrid.getTile(tpos.x - 1, tpos.y)?.tile

    let tile = initTile(img)



    //if never been generated, 
    //if neighbor exists import neighbor side, enabling protection
    //otherwise make a new side

    //if already generated, import the side
    //if neighbor exists, check if the side is protected and on neighbor
    //if not, set the side to the neighbor side
    //if it is, check if the sides matc
    //if it does not, return null

    function createSide(dir, sdir, cdir) {

        if (!img?.shared) {  // Check if img exists and has sides
            if (dir?.shared.sides?.[sdir]) {  // Check if dir and its sides exist
                protectNeighbor(dir, sdir, cdir);
                return true;
            } else {
                tile.shared.sides[cdir] = makeSide2();
                return true;
            }
        } else {
            tile.shared = img.shared;
            if (dir?.shared.sides?.[sdir]) {
                if (dir.shared.sides[sdir].protected) {
                    const currentSide = tile.shared.sides[cdir].get();
                    const neighborSide = dir.shared.sides[sdir].get();

                    let noMatch = false;
                    for (let s = 0; s < currentSide.length; s++) {
                        if (currentSide[s] !== neighborSide[s]) {
                            noMatch = true;
                            break
                        }
                    }
                    if (noMatch) return null;
                   return true
                } else {
                    protectNeighbor(dir, sdir, cdir);
                    return true;
                }
            }
            return true;  // Add return for case when there's no neighbor
        }
    }
    
    function protectNeighbor(dir, sdir, cdir) {
        const six = dir.shared.sides[sdir];
        tile.shared.sides[cdir] = six;
        six.protected = true;
    }
    if(!createSide(up, 2, 0)) return null;
    if(!createSide(right, 3, 1)) return null;
    if(!createSide(down, 0, 2)) return null;
    if(!createSide(left, 1, 3)) return null;
    img.shared = tile.shared;
    return tile;
}

let fileInput =  p.createFileInput((file)=>{
    if (file.type.startsWith('image')) {
        let imgdom = p.createImg(file.data,'', undefined, (img) => {
            if (img.width > 0 && img.height > 0) {
                let ti =createTile(img)
                if (ti == null) {
                    console.error('Tile does not fit');
                    return;
                }
                let t = { tile: ti, tpos, pos: tpos.screen() }
                worldGrid.setTile(tpos.x, tpos.y, t);
                tiles[tiles.length] = ti
                setTile(t)
                imgdom.tile = ti;
            } else {
                console.error('Failed to load image');
            }
        });
        imgdom.mousePressed(() => {
            let ti = createTile(imgdom.tile.img)
            let t = { tile: ti, tpos, pos: tpos.screen() }
            setTile(t)
            worldGrid.setTile(tpos.x, tpos.y, t);
          });
        leftMenu.add(imgdom)
        leftMenu.show()
    }
    setTile(null);
});
fileInput.hide();

let tileUi=null;


function setTile(t) {
    if (tile == t) return;
    tile=t
    if (t) { rightMenu.show() } else { rightMenu.hide() }

    tileUi?.remove(); //destroy tileui
    tileUi = p.createDiv(); //make it again
    tileUi.id("test2");
    rightMenu.add(tileUi);

    if (!tile?.tile) return;
    let i = 0
    if (tile.tile.shared.sides) {
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.shared.sides[i++], div);
        var div = p.createDiv().parent(tileUi)
        sideUI(tile.tile.shared.sides[i++], div);
    }

    var div = p.createDiv().parent(tileUi)
    let input = p.createInput('number').class("sidebit").parent(div).value(tile.tile.shared.weight);
        input.input(() => {
            let v = input.value();
            if (v.length <= 0) return;
            let a = Number.parseFloat(v);
            tile.tile.shared.weight = a;
        });
}
let editor = new n0fcEditor()

function sideUI(side, div, reverse = false) {
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
