import { cosmicEntityManager } from "../../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu } from "../../../engine/core/Menu/menu.mjs";
import { p } from "../../../engine/core/p5engine";
import { deltaTime } from "../../../engine/core/Time/n0Time.mjs";
import { n0tsEditorFiles, n0tsEditorTiles } from "../n0tsEditor.mjs";


export let invdiv = p.createDiv().class("invisible").hide();

let buttons = new Map();
let addButton = (cls, path)=> {
    let btn = buttons.get(cls);
    if (btn !== undefined) return btn;
    btn = {
        cls,
        path
    }
    buttons.set(cls, btn);
    return btn;
}

function summonSvg(svgId, size= 32 ) {
    let original = p.select(`#${svgId}`);
    if (!original) return;
    
    let clone = original.elt.cloneNode(true);
    clone.setAttribute('width', size);
    clone.setAttribute('height', size);
    //console.log(original, clone)
    
    let wrapper = p.createDiv().class(svgId);
    wrapper.child(clone);
    
    return wrapper;
}


addButton("add-tileset", "/assets/editor/addgroup.png")
export let n0TileEditorMenu = {
    sets: [], imgs: [],
    src: null, target: null, dragging: undefined,
    currentSet: {
        set: null,
        select(tileset) {
            if (this.set) this.set.div.removeClass("selected");
            this.set = tileset;
            this.set.div.addClass("selected");
        }
    },
    addSetGroup(name, cls) {
        let set = [];
        let menu = p.createDiv().class(cls);
        let titlebar = p.createDiv().class("titlebar").parent(menu)
        let title = p.createDiv().class("group-title").parent(titlebar);
        p.createSpan(name).parent(title);
        let buttons = p.createDiv().class("group-buttons").parent(titlebar)
        let svg = summonSvg('icon-plus', 32).parent(buttons)
        
        //let btn = addButton("add-tileset", "/assets/editor/addgroup.png")
        //let img = p.createDiv().class(btn.cls).parent(buttons);
        //console.log({btn, img})
        
        //p.createButton("add set").class("group-add").parent(buttons);
        let div = p.createDiv().class("sets").parent(menu);
        let createSpace = this.createSpace;
        let group = {
            name, menu, title, div,
            set, spaces: [], cls,
            rebuild() {
                var itemsa = Array.from(div.elt.children);
                for (const node of itemsa) {
                    invdiv.elt.appendChild(node);
                }
                for (let i = 0; i < this.set.length; i++) {
                    createSpace(this, i).div.parent(div);
                    this.set[i].div.parent(div)
                }
                createSpace(this, this.set.length).div.parent(div);
            },
            add(tile) {
                tile.set = this;
                this.set.push(tile);
            },
            insert(index, tile) {
                this.set.splice(index, 0, tile);
                tile.set = this;
            },
            indexOf(tile) {
                return this.set.indexOf(tile);
            },
            swap(tile1, tile2) {
                if (tile1.set !== tile2.set)
                    console.error("tile1 and tile2 are in different sets")
                let index1 = this.set.indexOf(tile1);
                let index2 = this.set.indexOf(tile2);
                this.set.splice(index1, 1, tile2)
                this.set.splice(index2, 1, tile1)
            },
            remove(tile) {
                let i = this.set.indexOf(tile);
                tile.set = null; //null means intentionally missing variable.
                this.set.splice(i, 1);
            },
            move(tile, index) {
                let i = this.set.indexOf(tile);
                this.set.splice(i, 1);
                this.set.splice(index, 0, tile)
            }
        }
        
        svg.mouseClicked(() => {
            n0TileEditorMenu.createSet(group, "tileset");
        })
        this.sets.push(group);
        return group;
    },
    createSpace(set, index) {
        if (set.spaces[index]) return set.spaces[index];
        let space = {
            index, div: p.createDiv().class("space").parent(invdiv)
        }
        space.div.elt.index = index;
        space.div.elt.move = (a) => {
            let aset = a.set;
            if (a.set === set) {
                set.move(a, index);
                set.rebuild()
            } else {
                a.set.remove(a);
                set.insert(index, a);
                aset.rebuild();
                set.rebuild();
            }
        }
        let over = () => {
            //space.div.addClass("dropspace")
            //subscribe to p5.js draw:
            if (n0TileEditorMenu.src && !n0TileEditorMenu.src.img) {
                drawTimer.space = space;
            }
        }
        let leave = () => {
            drawTimer.reset();
            //unsubscribe from p5.js draw:
            //space.div.removeClass("dropspace")
        }
        //idk why the this context doesn't exist here
        n0TileEditorMenu.adddrag(space.div, over, leave, leave);
        set.spaces[index] = space;
        return space;
    },
    createSet(group, title = "title") {

        //createSpace();
        let dib = p.createDiv().class("card").parent(invdiv);
        let titlebar = p.createDiv().class("titlebar").parent(dib);
        //p.createSpan(title).parent(tit);
        let titlebox = p.createInput(title).class("title-box").parent(titlebar);
        let grab = p.createDiv("⋮⋮").class("grab").parent(titlebar);
        let buttons = p.createDiv().class("group-buttons").parent(titlebar)
        let svg = summonSvg('icon-plus', 32).parent(buttons)
        
        let div = p.createDiv().class("set").parent(dib);
        let set1 = {
            title, group,
            titlediv: titlebar, titlebox,
            div: dib,
            imgsdiv: div,
            imgs: []
        }
        titlebox.input(() => {
            set1.title = titlebox.value();
        });
        let selecti = () => {
            this.currentSet.select(set1);
        }
        titlebox.mouseClicked(selecti) 
        grab.mouseClicked(selecti)

        set1.div.attribute('draggable', 'true');
        set1.div.elt.addEventListener('dragstart', (e) => {
            if (this.src === null) {
                this.src = set1;
                set1.div.addClass("dragging")
                e.dataTransfer.setDragImage(emptyImg, 0, 0);
            }
        });
        set1.div.elt.addEventListener('dragend', (e) => {
            if (this.src === set1) {
                //console.log (src, target);
                this.target.move?.(this.src);
                set1.div.removeClass("dragging")
                this.src = null;
                this.dragging = undefined;
            }
        });
        set1.imgsdiv.elt.add = (a) => {
            console.log("adding img to div", set1, a);
            a.img.parent(set1.imgsdiv)
        }

        let move = (other) => {
            if (set1.set === other.set) {
                set1.set.swap(set1, other)

                set1.set.rebuild();
            } else {
                let a = set1.set;
                let b = other.set;
                let si = a.indexOf(set1);
                let oi = b.indexOf(other);

                a.remove(set1);
                b.remove(other);
                a.insert(si, other);
                b.insert(oi, set1);

                a.rebuild();
                b.rebuild();
            }

        }
        set1.imgsdiv.elt.move = move;
        set1.titlediv.elt.move = move;
        set1.titlebox.elt.move = move;

        let drop = () => { 
            if (set1 !== this.src) 
                set1.div.removeClass("moveover") 
            }
        this.adddrag(set1.div, () => { 
            if (set1 !== this.src) 
                set1.div.addClass("moveover") 
            }, drop, drop)
        
        group.add(set1);
        set1.div.parent(group.div)

        this.rebuild();
        svg.mouseClicked(() => {
            let set = this.currentSet.set
            this.currentSet.set = set1;
            console.log("adding img to ", set1)
            n0tsEditorFiles.openQuiet()
            
            this.currentSet.set = set1;
            console.log("implement add image")
        })
            //this.sets.push(set1);
        return set1;
    },
    addImage(imgdiv) {
        this.imgs.push(imgdiv);
        //let imgdiv = p.createImg(img.canvas.toDataURL())
        imgdiv.attribute('draggable', 'true');
        imgdiv.elt.addEventListener('dragstart', (e) => {
            if (this.src === null) {
                this.src = imgdiv;
                imgdiv.addClass("dragging")
                this.dragging = { img: this.src };
                e.dataTransfer.setDragImage(emptyImg, 0, 0);
            }

        });
        imgdiv.elt.addEventListener('dragend', (e) => {
            if (imgdiv === this.src) {
                imgdiv.removeClass("dragging")
                this.target.add?.(this.src);
                this.src = null;
                this.dragging = undefined;
            }
        });
        this.currentSet.set.imgs.push(imgdiv);

        imgdiv.set =  this.currentSet;
        
        console.log("adding img to set", imgdiv.set.set.group)
        imgdiv.parent(this.currentSet.set.imgsdiv);
    },
    rebuild() {
        for (const set of this.sets) {
            set.rebuild();
        }
    },
    adddrag(div, over, leave, end) {
    div.elt.addEventListener('dragover', (e) => {
        this.target = e.target;
        over?.(e)
        e.preventDefault(); // This is crucial - allows dropping
    });
    div.elt.addEventListener('dragleave', (e) => {
        //target = e.target;
        leave?.(e)
        e.preventDefault(); // This is crucial - allows dropping
    });
    div.elt.addEventListener('drop', (e) => {
        //target = e.target;
        end?.(e)
        e.preventDefault(); // This is crucial - allows dropping
    });
}
}

let drawTimer = {
    space: null,
    t: 0, draw() {
        if (this.space === null) return;

        this.t += deltaTime;
        p.fill(255, 255, 255)
        p.text(`${this.t}`, 20, 20)
        if (this.t > .5)
            this.space.div.addClass("dropspace");

    },
    reset() {
        if (this.space !== null)
            this.space.div.removeClass("dropspace");
        this.space = null; //null means intentionally missing variable
        this.t = 0;
    }

}

//this var allows the drag function defined above to hide the drag preview
//if i used let here the functions would not work
var emptyImg = new Image();
emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

/*
this is how we can integrate drag and drop into the canvas
canvas.elt.add = (a) => {
    elta.imgs.push({img: a, x: p.mouseX, y: p.mouseY })
}
adddrag(canvas)
*/


cosmicEntityManager.addEntity(drawTimer);
let tsm = n0TileEditorMenu.addSetGroup("sets", "sets-menu");
leftMenu.add(tsm.menu)
let jsm = n0TileEditorMenu.addSetGroup("secondary sets", "sets-menu");
leftMenu.add(jsm.menu)
let tsk = n0TileEditorMenu.addSetGroup("joint sets", "joint-sets-menu");
leftMenu.add(tsk.menu)

let set1 = n0TileEditorMenu.createSet(tsm, "1");
n0TileEditorMenu.currentSet.select(set1);