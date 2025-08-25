class Power{
    zap(){}
}
let a = () => {
    return {zap(){}}
}
console.logp(a().zap())