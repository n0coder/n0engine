export function event(a){
    let e = (...args) => {
        for(let l of e.o) {
            l?.(...args)
        }
    }
    e.o=[a]
    e.add = (l) => {
        e.o.push(l)
    }
    e.remove = (l) => {
       let i = e.o.indexOf(l);
       e.o.splice(i,1)
    }
    return e;
}