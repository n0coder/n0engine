
import { BiomeFunctionCollapse } from "./world/wave/biomeFunctionCollapse.mjs"
import { DebugCursor } from "./world/debugCursor.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { DecoCollapse } from "./world/wave/decoCollapse.mjs";
import { clamp, inverseLerp, lerp } from "../engine/n0math/ranges.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../engine/core/p5engine.mjs";
// we need to form a basic world generation layout for the nanos, something simple and cute

// form based on the nanos size, a realtive difficulty to find water, which will then change based on humidity and temperature
// we need a solid world size, then we should form the biome noises. tough challenge

//the world is already really good, we just need to improve the bitter/sugar biome techs

// we also need to test drive searching for water
//var bfc = new DecoCollapse()
//var mc = new DebugCursor();

var abi = new Nanoai("abi",14, 12)
var n0 = new Nanoai("n0", 12,12); 


//make decoration tech using n0functioncollapse
//place water (objects) in water (tiles)
n0.brain.do("ping", () => {
	var x = worldGrid.x;
	var y = worldGrid.y;
	let wt = []
	for (let i = 0; i < bfc.w + 1; i++) {
		for (let o = 0; o < bfc.h + 1; o++) {
			var biome = worldGrid.tiles.get(`${x + i}, ${y + o}`)
			if (biome?.biome?.name?.includes("water"))
				wt.push(biome);
		}
	}
	console.log(wt)
})

//this is a floating read

//i'm going to write another aspect of my noise biome map system. 
//i need to form transition spaces, 
//this is to give my wave function collapse system(which acts as a decorator) 
//a way to change the probablility of a tile given it's relative position on the transition space.
//the general idea of having transition tiles have high probability half way through the transition, 
//falling off more towards the biome as it reaches the edge.
//this is what i call space categorization systems.
//they're really closely related to space remap systems

//gather the edges of biomes, expand them and them cast a lerp along the space.
//we will want to control how the lerp casts.

/*
thinking, we have a range from -1 to 1,
we can essentially categorize the whole ints
-1 to 0 is red
0 to 1 is green
given this space we can find the line (easy here: it's 0)
then we expand the space into a new category (-.1 to .1 is yellow)

this yellow is a transition space. now, for the more difficult aspect, we want to have probabilities of yellow tiles increase as we reach 0. this could just be an inverse lerp mapping.
let yellowProbability = inverseLerp(0, .1, math.abs(value)) * strength
this wouldn't be super practical, as it expects one transition space, which means this in an of iself does not meet my quality standard. i will need to continue improving the idea
*/
/*
let i = -1, o = 1;
let p = lerp(i,o, 0.5), len = .1;
let pi = p - len, po = p + len;
console.log([i, p, o], [i, pi, po, o])
*/
//cardioid?
class iopVisualizer {
	constructor() {
		this.start = -1, this.end = 1;
		this.position = .5;
		this.length = .1;
	}
	draw() {
		let x = 128, y = 64;
		p.fill(255, 111,111)
		p.ellipse(x + (this.start * 32), y, 4)
		p.fill(111, 255,111)
		p.ellipse(x + (this.end * 32), y, 4)
		this.makepos(this.position, x, y);
		this.makepos(this.position-this.length, x, y);
		this.makepos(this.position+this.length, x, y);
	}

	makepos(pos, x, y) {
		let poso = lerp(this.start, this.end, pos);
		let r = lerp(255, 111, pos);
		let g = lerp(111, 255, pos);
		p.fill(r, g, 111);
		p.ellipse(x + ((poso) * 32), y, 8);
		return poso;
	}
}
let iop = new iopVisualizer();
cosmicEntityManager.addEntity(iop);

function calculateWeight(poso, pos, weight = .5) {
  
  return (-Math.pow(clamp(0,1, Math.abs(pos-poso)), weight))+1 //we add 1 to the end to pull the flipped value out of the ground
}
console.log(calculateWeight(-1, 1))
console.log(calculateWeight(0, 1))
console.log(calculateWeight(1, .9))
console.log(calculateWeight(1, 1))
let poso = 2, pos = 2;
console.log( )