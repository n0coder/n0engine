import { p } from "../p5engine.mjs";

//this is a function to deep copy something so hard it duplicates atoms
export function atomicClone(oldObj) {
    let newObj = new Object();
    for (let key in oldObj) {
        if (oldObj[key] === null) {
            newObj[key] = oldObj[key];
        }else if (Array.isArray(oldObj[key])) {
            newObj[key] = oldObj[key].slice()
        }
        else if (typeof oldObj[key] === 'object') {
            newObj[key] = atomicClone(oldObj[key])
        } else {
            newObj[key] = oldObj[key];
        }
    }
    return newObj;
}

export const imageMap = new Map();

export function loadImg(obj, vari, path) {
    var imga =imageMap.get(path);
    if (imga) { //if we already loaded the image, copy it into the new object
        obj[vari]=imga;
    } else if (obj[vari] === undefined && !obj["loading"]) {
        p.loadImage(path, img => {
            imageMap.set(path, img);
            obj[vari] = img;
            delete obj["loading"]
        });
        obj["loading"] = true;
    }
}