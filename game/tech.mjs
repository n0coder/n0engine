//load loader
//setup dependancies
import { p } from "../engine/core/p5engine.mjs";
import { n0loader } from "../engine/core/ResourceManagement/loader.mjs";

n0loader.startLoading('world', (done) => {
    import("./worldExploration.mjs")
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