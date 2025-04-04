class Power{
    zap(){}
}
let a = () => {
    return {zap(){}}
}
console.log(a().zap())