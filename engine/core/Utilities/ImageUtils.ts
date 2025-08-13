import { p } from "../p5engine.ts";

export const imageMap = new Map();
let loadingMap = new Map()
export function loadImg(path, imgOut) {
    var imga = imageMap.get(path);
    if (imga !== undefined) { 
        imgOut?.(imga); 
        return;
    }
    let loada = loadingMap.get(path);
    if (!loada) {
        loada = [imgOut];
        loadingMap.set(path, loada);
        p.loadImage(path, img => {
            imageMap.set(path, img);
            for (const load of loada) {
                load(img)
            }
            loadingMap.delete(path);
        });
    } else loada.push(imgOut);
}

export function loadImgArray(path, num, callback) {
    let imgArray = new Array(num); // Pre-allocate array with correct size
    let loadedCount = 0;
    
    for (let i = 0; i < num; i++) {
        let imgPath = `${path}/${i}.png`;
        let index = i; // Capture current index for closure
        
        loadImg(imgPath, img => {
            imgArray[index] = img; // Store at correct index
            loadedCount++;
            
            if (loadedCount === num) {
                callback(imgArray);
            }
        });
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