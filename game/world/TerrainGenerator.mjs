import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs"
import { p } from "../../engine/core/p5engine.mjs"
import { worldGrid } from "../../engine/grid/worldGrid.mjs"
import Alea from 'alea';
import { createNoise2D } from 'simplex-noise'
import { blend, blendw, clamp, inverseLerp, lerp } from '../../engine/n0math/ranges.mjs'
import { gameH, gameW } from "../../engine/n0config.mjs";
import { RangeMap } from "../../engine/collections/RangeMap.mjs"
import { getBiome, minmax, worldFactors } from "./FactorManager.mjs";
export class TerrainGenerator {
    constructor(nano) {
        this.setActive = setActive;
        this.setActive(true)
        this.renderOrder = -5;
        this.random = "abi";
        this.alea = Alea(this.random)
        this.nano = nano;
        this.min = Infinity;
        this.max = -Infinity;

    }
    init() {
        for (const [k, v] of worldFactors) {
            v.init(createNoise2D(this.alea));
        }
    }
    /*
    setup() {

        let menuDiv = p.select("#menu"); // Select the menu div using its id
        menuDiv.style("width", "256px"); // Set the width of the div to 256 pixels
        let testDiv = p.createDiv(); // Create a new div
        testDiv.id("test"); // Set the id of the div to "test"
        testDiv.parent(menuDiv); // Set the parent of the div to the menu div
        let testDiv2 = p.createDiv(); // Create a new div
        testDiv2.id("test2"); // Set the id of the div to "test"
        testDiv2.parent(testDiv);
        this.lengthSlider = p.createSlider(0, 512, length);
        this.lengthSlider.parent('test2');

        this.outputText = p.createP();
        this.outputText.parent('test2');

        let button = p.createButton("update");
        button.parent('test2');
        button.mousePressed(() => {
            this.outputText.html(this.lengthSlider.value())
        });
    }
    */

    updateMap() {
        var obj = new Map();

        for (let x = 0; x < worldGrid.chunkSize * 7; x++) {
            for (let y = 0; y < worldGrid.chunkSize * 4; y++) {

                var gridNano = worldGrid.screenToGridPoint(this.nano.x, this.nano.y);

                var gw = gridNano.x, gh = gridNano.y
                //var brightness = inverseLerp(-1,1, this.getNoise((x),(y), 50, 4, .5,2));
                var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1)
                var biome = getBiome(x + gw, y + gh) // *255
                biome ||= [0, 0, 0] //when no value, display black
                obj.set(`${x},${y}`, { biome })
            }
        }
        console.log(minmax);
        this.map = obj;
    }
    draw() {
        for (let x = 0; x < worldGrid.chunkSize * 7; x++) {
            for (let y = 0; y < worldGrid.chunkSize * 4; y++) {
                var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1)
                if (this.map) {
                    var biome = this.map.get(`${x},${y}`)
                    p.fill(biome?.biome || [0, 0, 0]);
                    p.rect(v.x, v.y, v.w, v.h)
                }
            }
        }
    }
}