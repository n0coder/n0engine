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