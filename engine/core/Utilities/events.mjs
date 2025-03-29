export function event(a){
    let e = (...args) => {
        for(let [t, l] of e.o) {
            l?.(...args)
        }
    }
    e.o=new Map()
    if (a) e.o.set(a,a)
    e.add = (t, l) => {
        e.o.set(t,l)
    }
    e.remove = (t) => {
       let i = e.o.delete(t);
    }
    return e;
}