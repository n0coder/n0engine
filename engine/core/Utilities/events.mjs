export function event(a){
    let callback = (...args) => {
        for(let [t, l] of callback.listeners) {
            l?.(...args)
        }
    }
    callback.listeners=new Map()
    if (a) callback.listeners.set(a,a)
    callback.add = (t, l) => {
        callback.listeners.set(t,l)
    }
    callback.remove = (t) => {
       let i = callback.listeners.delete(t);
    }
    return callback;
}