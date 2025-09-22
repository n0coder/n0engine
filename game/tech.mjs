//load loader
//setup dependancies
import { p } from "../engine/core/p5engine.ts";
import { n0loader } from "../engine/core/ResourceManagement/loader.ts";
import { worldGrid } from "../engine/grid/worldGrid.ts";

n0loader.startLoading('world', (done) => {
    import("./tests/saving.mjs")
      .then(() => done())
      .catch((e) => {
        console.error("Failed to load world", e); //this never runs btw XD
        done(e);
      })
    .then((script)=>{
      n0loader.setPhase("nano")
        done();
    })
},/*['tiles']*/);
/*
n0loader.startLoading('assets', (done) => {
    import("./world/wave/waveImport.mjs")
    .then((script)=>{
        script.load(done)
    })
});
*/
