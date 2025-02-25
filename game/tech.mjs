//load loader
//setup dependancies
import { p } from "../engine/core/p5engine.mjs";
import { n0loader } from "../engine/core/ResourceManagement/loader.mjs";
let experiment ="./tools/n0fcEditor.mjs" //"./world.mjs;"
n0loader.startLoading('world', (done) => {
    import("./tools/n0fcEditor.mjs")
    .then((script)=>{
        done();
    })
}, ['assets']);
n0loader.startLoading('assets', (done) => {
    import("./assets.mjs")
    .then((script)=>{
        script.load(done)
    })
});