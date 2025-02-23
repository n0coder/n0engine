//load loader
//setup dependancies

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
/*
n0loader.startLoading('feature', (done) => {
    import('./world.mjs')
        .then((module) => {
            // Module is loaded, call done to signal completion
            done();
            // Now you can use the module
            module.sayHello(); // "Hello from feature!"
        })
        .catch((err) => {
            console.error('Failed to load feature:', err);
            done(); // Still call done, or handle errors differently
        });
});
*/