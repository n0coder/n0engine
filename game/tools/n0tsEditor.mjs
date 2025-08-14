

//n0ts.

import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { p } from "../../engine/core/p5engine"
import { worldGrid } from "../../engine/grid/worldGrid.mjs"

/* 

function addTiles(def) {
    for (let i = 0; i < def.imgRules.length; i++) {
        let [index, file, sides] = def.imgRules[i];
        let n0tile = new Tile(`${def.path}/${file}`, def.name);
        n0tile.setSides(sides)
        n0tile.setWeight(def.weight);
        n0tile.addThresholds(def.thresholds);
        n0tile.addBiases(def.biases);
        if (def.map)
            def.map.set(`${def.name}${index}`, n0tile)
        else
            n0tiles.set(`${def.name}${index}`, n0tile)
        
    }
}

addTiles({
    name: "purple",
    path: "/assets/wave/purple", 
    imgRules: [
        [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]],
        [3, "3.png", [[0,0,0],[0,0,0],[0,1,0],[0,1,0]]],
        [4, "4.png", [[0,1,0],[0,1,0],[0,0,0],[0,0,0]]],
        [5, "5.png", [[0,0,0],[0,1,0],[0,1,0],[0,0,0]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: -1}]
})

*/



let visualizer = { 
    draw(){
        let mouse = worldGrid.mouseTile
        p.rect(mouse.x, mouse.y, worldGrid.tileSize, worldGrid.tileSize)
    }
}
cosmicEntityManager.addEntity(visualizer)