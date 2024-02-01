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
            if (oldObj[key] instanceof Map) 
                newObj[key] = new Map(oldObj[key]);
            else
                newObj[key] = atomicClone(oldObj[key])
            
        } else {
            newObj[key] = oldObj[key];
        }
    }
    return newObj;
}
export function cloneAction(obj, also, ...args) {
    //let clone = atomicClone(obj);
    //clone.args = [...args];
    let action = [];
    also?.(obj, action, args);
    action.push(obj);
    return action;
  }
export const imageMap = new Map();

export function loadImg(path, imgOut) {
    var imga = imageMap.get(path);
    if (imga !== undefined) { 
        imgOut?.(imga); 
        return;
    }
    p.loadImage(path, img => {
        imageMap.set(path, img);
        imgOut?.(img);
    });
}
export function loadImgArray(path, num, callback) {
    let imgArray = [];
    for (let i = 0; i < num; i++) {
        let imgPath = `${path}/${i}.png`;
        let imga = imageMap.get(imgPath);
        if (imga) { // If the image is in the cache, use it directly
            imgArray.push(imga);
            if (imgArray.length === num) {
                callback(imgArray);
            }
        } else { // If the image is not in the cache, load it
            p.loadImage(imgPath, img => {
                imageMap.set(imgPath, img); // Store the loaded image into the cache
                imgArray.push(img);
                if (imgArray.length === num) {
                    callback(imgArray);
                }
            });
        }
    }
}



//we make a map to hold animation sets
export let animationSetMap = new Map();
export function addAnimationSet(key, key2, values){
    //an animation set for a specific entity
    var animap = animationSetMap.get(key);
    if (!animap) {
        animap = new Map();
        animationSetMap.set(key, animap);
    }
    //and then the animation set itself
    var animap2 = animap.get(key2);
    if (!animap2) {
        animap2 = values || []
        animap.set(key2, animap2);
    }
    return animap;
} //
export function getAnimation(key, key2, frame) {
    var aset = animationSetMap.get(key);
    if (!aset) {
        //console.log(`there's no animation set for ${key}, ${key2}`,animationSetMap)
        return null;
    }
    var aset2 = aset.get(key2)
    if (!aset2) {
        //console.log(`there's no animation set for ${key}, ${key2}`, animationSetMap)
        return null;
    }
    return aset2[frame%aset2.length]
}



//a test map for
//

//console.log()