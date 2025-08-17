import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { leftMenu, rightMenu } from "../../engine/core/Menu/menu.mjs";
import { canvas, p } from "../../engine/core/p5engine";
import { loadImg } from "../../engine/core/Utilities/ImageUtils";

let invdiv = p.createDiv().class("invisible").hide();
let div = p.createDiv().class("sets");
leftMenu.add(div)

let imgs = []
let sets = []

let src = null, target = null, dragging = undefined;
function createSet() {
let set1 = {
    div:  p.createDiv().class("set").parent(div),
    imgs: []
}

set1.div.attribute('draggable', 'true');
    set1.div.elt.addEventListener('dragstart', (e) => {
        if (src === null) {
            src = set1;
            e.dataTransfer.setDragImage(emptyImg, 0, 0);
        }
    });
set1.div.elt.addEventListener('dragend', (e) => {
    if (src === set1) {
        target.move(src);
        src = null;
        dragging = undefined;
    }
});

set1.div.elt.add = (a) => {
    a.parent(set1.div)
}
set1.div.elt.move = (draggedSet) => {
    let currentSetIndex = sets.indexOf(set1);  // target set
    let draggedSetIndex = sets.indexOf(draggedSet);  // dragged set
    
    if (currentSetIndex === -1 || draggedSetIndex === -1) return;
    
    let currentDiv = set1.div.elt;
    let draggedDiv = draggedSet.div.elt;
    let parent = currentDiv.parentNode;
    let placeholder = document.createElement('div');
    placeholder.style.display = 'none';
    parent.insertBefore(placeholder, currentDiv);
    parent.insertBefore(draggedDiv, placeholder);
    parent.insertBefore(currentDiv, draggedDiv.nextSibling);
    parent.removeChild(placeholder);
    [sets[currentSetIndex], sets[draggedSetIndex]] = [sets[draggedSetIndex], sets[currentSetIndex]];
};
adddrag(set1.div)
sets.push(set1);
return set1;
}

let elta = {
    imgs: [],
    draw() {
        for (const img of this.imgs) {
            p.image(img.img, img.x, img.y, img.img.width, img.img.height)
        }
        
        if (dragging?.img !== undefined) {
            try {
            p.image(dragging.img, p.mouseX, p.mouseY, dragging.img.width, dragging.img.height)
            } catch {
                console.log(dragging)
            }
        } 
    }
}
cosmicEntityManager.addEntity(elta);

canvas.elt.add = (a) => {
    elta.imgs.push({img: a, x: p.mouseX, y: p.mouseY })
}

let adddrag = (div) => {
    div.elt.addEventListener('dragover', (e) => {
        target = e.target;
        e.preventDefault(); // This is crucial - allows dropping
    });
}
adddrag(canvas)


let set1 = createSet();
createSet();
createSet();
createSet();
createSet();
createSet();
createSet();
createSet();
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
            dragging = {img: src};
            e.dataTransfer.setDragImage(emptyImg, 0, 0);
        }

    });
    imgdiv.elt.addEventListener('dragend', (e) => {
        if (imgdiv=== src) {
            target.add(src);
            src = null;
            dragging = undefined;
        }
    });

    currentSet.imgs.push(imgdiv);
    imgdiv.parent(currentSet.div);
}
loadImg("/assets/wave/green/0.png", addImg)
loadImg("/assets/wave/green/1.png", addImg)

leftMenu.show();

