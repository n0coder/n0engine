//load loader
//setup dependancies
import { p } from "../engine/core/p5engine.mjs";
import { n0loader } from "../engine/core/ResourceManagement/loader.mjs";
let experiment ="./tools/n0fcEditor.mjs" //"./world.mjs;"
n0loader.startLoading('world', (done) => {
    import("./experiments/newJobScoring.mjs")
    .then((script)=>{
        done();
    })
}, ['tiles']);
n0loader.startLoading('assets', (done) => {
    import("./world/wave/waveImport.mjs")
    .then((script)=>{
        script.load(done)
    })
});