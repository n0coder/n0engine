//load loader
//setup dependancies
import { p } from "../engine/core/p5engine.ts";
import { n0loader } from "../engine/core/ResourceManagement/loader.mjs";

n0loader.startLoading('world', (done) => {
    import("./tests/UItechs.mjs")
      .then(() => done())
      .catch((e) => {
        console.error("Failed to load world", e);
        done(e);
      })
    .then((script)=>{
        done();
    })
},['tiles']);

n0loader.startLoading('assets', (done) => {
    import("./world/wave/waveImport.mjs")
    .then((script)=>{
        script.load(done)
    })
});
