

//this is a function to deep copy something so hard it duplicates atoms
export function atomicClone(oldObj) {
    let newObj = {};
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
  



//a test map for
//

//console.log()