import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { canvas, p } from "../../engine/core/p5engine";
import { deltaTime } from "../../engine/core/Time/n0Time.mjs";
import { loadImg } from "../../engine/core/Utilities/ImageUtils";

let invdiv = p.createDiv().class("invisible").hide();
let setsMenu = p.createDiv().class("sets-menu");
let jointSetsMenu = p.createDiv().class("joint-sets-menu");
let div = p.createDiv().class("sets").parent(setsMenu);
let jointDiv = p.createDiv().class("sets joint").parent(jointSetsMenu);
leftMenu.add(setsMenu)
leftMenu.add(jointSetsMenu)

let imgs = [];
let tileSets = [], jointSets = [];
let setsv = [
]
function addSetGroup(set) {
    let group = {
        set, spaces:[],
        add(tile) {
            tile.set = this;
            this.set.push(tile);
        },
        insert(index, tile) {
            this.set.splice(index, 0, tile);
            tile.set = this;
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

    setsv.push(group);
}
addSetGroup(tileSets);
addSetGroup(jointSets)
let src = null, target = null, dragging = undefined;


    let drawTimer = {
        space: null,
        t:0, draw() {
            if (this.space === null) return;
            
                this.t+=deltaTime; 
                p.fill(255,255,255)
                p.text(`${this.t}`,20, 20 )
                if (this.t > .5)
                this.space.div.addClass("dropspace");
            
            },
            reset () { 
                if (this.space !== null)
                this.space.div.removeClass("dropspace"); 
                this.space = null; //null means intentionally missing variable
                this.t = 0; 
            }
    }
cosmicEntityManager.addEntity(drawTimer);

function createSpace(set, index) {
    if (set.spaces[index]) return set.spaces[index];

    let space = {
        index, div: p.createDiv().class("space").parent(invdiv)
    }
    space.div.elt.index = index;
    space.div.elt.move = (a) => {
        if (a.set === set) 
            set.move(a, index);        
        else {
            a.set.remove(a);
            set.insert(index, a);
        }

        rebuildMenu();

        
    }
    let over = () => {
        //space.div.addClass("dropspace")
        //subscribe to p5.js draw:
        if (src && !src.img ) {
            drawTimer.space = space;
        }
    }
    let leave = () => {
        drawTimer.reset();
        //unsubscribe from p5.js draw:
        //space.div.removeClass("dropspace")
    }
    adddrag(space.div, over, leave, leave);
    set.spaces[index] = space;
    return space;
}

function createSet(sets, title= "title") {

    //createSpace();
    let dib = p.createDiv().class("card").parent(invdiv);
    let tit = p.createDiv().class("card-title").parent(dib);
    //p.createSpan(title).parent(tit);
    let titlebox = p.createInput(title).class("title-box").parent(tit);
    
    let div = p.createDiv().class("set").parent(dib);
    let set1 = {
        title,
        titlediv: tit, titlebox,
        div:dib,
        imgsdiv: div,
        imgs: []
    }
    titlebox.input(() => {
        // Immediate feedback - updates as user types
        set1.title = titlebox.value();
        // Optional: trigger any live preview updates here
    });
set1.div.attribute('draggable', 'true');
set1.div.elt.addEventListener('dragstart', (e) => {
    if (src === null) {
        src = set1;
        set1.div.addClass("dragging")
        e.dataTransfer.setDragImage(emptyImg, 0, 0);
    }
});
set1.div.elt.addEventListener('dragend', (e) => {
    if (src === set1) {
        //console.log (src, target);
        target.move?.(src);
        set1.div.removeClass("dragging")
        src = null;
        dragging = undefined;
    }
});
set1.imgsdiv.elt.add = (a) => {
    console.log(a);
    a.img.parent(set1.imgsdiv)
}

let move = (other) => {
    if (set1.set === other.set) {
        set1.set.swap(set1, other)
    } else {
        let a = set1.set;
        let b = other.set;
        
        a.remove(set1);
        b.remove(other);
        a.add(other);
        b.add(set1);
    }
    
    rebuildMenu();
}
set1.imgsdiv.elt.move = move;
set1.titlediv.elt.move = move;
set1.titlebox.elt.move = move;

let drop = () => { if (set1 !== src) set1.div.removeClass("moveover")  }
    adddrag(set1.div, () => { if (set1 !== src) set1.div.addClass("moveover")  }, drop, drop)

    sets.add(set1);
return set1;
}

let elta = {
    imgs: [],
    draw() {
        for (const img of this.imgs) {
            p.image(img.img, img.x, img.y, img.img.width, img.img.height)
        }
        
        if (dragging?.img !== undefined) {
                p.image(dragging.img, p.mouseX, p.mouseY, dragging.img.width, dragging.img.height)
        } 
    }
}
cosmicEntityManager.addEntity(elta);

canvas.elt.add = (a) => {
    console.log(a)
    elta.imgs.push({img: a, x: p.mouseX, y: p.mouseY })
}

let adddrag = (div, over, leave, end) => {
    div.elt.addEventListener('dragover', (e) => {
        target = e.target;
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
adddrag(canvas)

let set1 = createSet(setsv[0], "1");
createSet(setsv[0],"2");
createSet(setsv[0], "3");

createSet(setsv[1],"4");
createSet(setsv[1], "5");

function rebuildMenu() {
    var itemsa = Array.from(div.elt.children);
    for (const node of itemsa) {
        invdiv.elt.appendChild(node);
    }
    var itemsa = Array.from(jointDiv.elt.children);
    for (const node of itemsa) {
        invdiv.elt.appendChild(node);
    }

    let ts = setsv[0];
    for (let i = 0; i < ts.set.length; i++) {
        createSpace(ts, i).div.parent(div);
        console.log({ts, set:ts.set[i] })
        ts.set[i].div.parent(div)
    }
    createSpace(ts, ts.set.length).div.parent(div);

    let js = setsv[1];
    for (let i = 0; i < js.set.length; i++) {
        createSpace(js, i).div.parent(jointDiv);
        js.set[i].div.parent(jointDiv)
    }
    createSpace(js, js.set.length).div.parent(jointDiv);
}
rebuildMenu()

//createSpace();


let currentSet = set1;
//let imgdiv = p.createImg(img.img.canvas.toDataURL()).class("img").parent(setdiv);

let emptyImg = new Image();
emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

let addImg = (img)=>{ 
    imgs.push(img);
    let imgdiv = p.createImg(img.canvas.toDataURL())
    imgdiv.attribute('draggable', 'true');
    imgdiv.elt.addEventListener('dragstart', (e) => {
        if (src === null) {
            src = imgdiv;
            src.img = imgdiv;
            imgdiv.addClass("dragging")
            dragging = {img: src};
            e.dataTransfer.setDragImage(emptyImg, 0, 0);
        }

    });
    imgdiv.elt.addEventListener('dragend', (e) => {
        if (imgdiv=== src) {
            imgdiv.removeClass("dragging")
            target.add?.(src);
            src = null;
            dragging = undefined;
        }
    });

    currentSet.imgs.push(imgdiv);
    imgdiv.parent(currentSet.imgsdiv);
}
loadImg("/assets/wave/green/0.png", addImg)
loadImg("/assets/wave/green/1.png", addImg)

leftMenu.show();

