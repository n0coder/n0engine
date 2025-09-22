import { DebugCursor } from "./world/debugCursor.mjs"
import {Nanoai} from "./nanoai/nanoai.mjs"
import { worldGrid } from "../engine/grid/worldGrid.ts";
import { clamp, inverseLerp, lerp } from "../engine/n0math/ranges.mjs";
import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../engine/core/p5engine.ts";
import { gameW } from "../engine/n0config.mjs";
import { deltaTime } from "../engine/core/Time/n0Time.mjs";
import { perpandicular } from "../engine/n0math/vectorMath.mjs";
// we need to form a basic world generation layout for the nanos, something simple and cute

// form based on the nanos size, a realtive difficulty to find water, which will then change based on humidity and temperature
// we need a solid world size, then we should form the biome noises. tough challenge

//the world is already really good, we just need to improve the bitter/sugar biome techs

// we also need to test drive searching for water
//var bfc = new DecoCollapse()
//var mc = new DebugCursor();
class Drawing{
	constructor() {
		this.x = 200;
		this.y = 200;
		this.r = 16;
		this.t = 0;
		this.s = 5;
	}
	draw() {
		let s = ((1+Math.sin((this.t*3)+(3.14/4)))/2)
		var i = Math.sin(this.t)*48*s*this.s
		var o = Math.cos(this.t)*48*s*this.s;
		
		p.ellipse(this.x+i, this.y+o, 25*this.s*s);
		var [i,o]=[-o,i];
		p.ellipse(this.x+i, this.y+o, 25*this.s*s)
		var [i,o]=[-o,i];
		p.ellipse(this.x+i, this.y+o, 25*this.s*s)
		var [i,o]=[-o,i];
		p.ellipse(this.x+i, this.y+o, 25*this.s*s)
		this.t+=deltaTime;
	}
}
let drawing = new Drawing()
cosmicEntityManager.addEntity(drawing)


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


function cw(poso, pos, weight = .5) {
	return (-Math.pow(clamp(0,1, Math.abs(pos-poso)), weight))+1 //we add 1 to the end to pull the flipped value out of the ground
  }

  let hapiness = .2
  let unhappy = cw(-1, hapiness)
  let neutral = cw(0, hapiness)
  let happy = cw(1, hapiness)
  console.log([unhappy, neutral, happy])
class iopVisualizer {
	constructor() {
		this.start = -1, this.end = 1;
		this.position = .5;
		this.length = .1;
	}
	draw() {
		let startX = 0, startY = 0
		let endX = 30*4, endY = 20*4;
		for (let x = startX; x < endX; x++) {
			for (let y = 1*4; y < 2*4; y++) {
				var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1);
				var invPos = lerp(-1, 1, inverseLerp(startX, endX, x));
				let biomi = cw(-1, invPos*10)
				let biomiR = 255 * biomi
				let biomiG = 111 * biomi
				let didi =  cw(0, invPos*10)
				let didiR = 255 * didi;
				let didiG = 255 * didi;
				let midi =  cw(1, invPos*10)
				let midiR = 111 * midi;
				let midiG = 255 * midi;
				p.fill (biomiR+didiR+midiR,biomiG+didiG+midiG,111);
				p.rect(v.x, v.y, v.w, v.y)
			}
			
		}
		let size = 8;
		
		for (let x = startX; x < endX; x++) {
			for (let y = 8; y < 12; y++) {
				var v = worldGrid.gridBoundsScreenSpace(x, y, 1, 1);
				var invPos = lerp(-1, 1, inverseLerp(startX, endX, x));
				
				let biomiR = 255 
				let biomiG = 111 
				let didiR = 255 
				let didiG = 255 
				let midiR = 111 
				let midiG = 255 

				let start = -1;
				let end = 1;
				let mid = .5


				p.fill (biomiR+didiR+midiR,biomiG+didiG+midiG,111);
				p.rect(v.x, v.y, v.w, v.y)
			}			
		}
		

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
//this was ugly and got in the way, but it's nice to have to test bounds issues in the tecH
//let iop = new iopVisualizer();
//cosmicEntityManager.addEntity(iop);


// on every dimension gather the min maxes of biomes
// we should expand the minmax into smaller local zone minmaxes

// min - .1, max + .1
// of every biome, keeping track of overlaps
// note every overlap, so we can form transition tiles

// we'll shift the probabilities based on the side of the biome
// all the way in the forest, we have full trees, 
// all the way in the plains, we have none or few, 
// for a grass to sand type situation, we do the probability shifting
// but also make halfway there be full transition tiles.


// reminder, this is an 8 or 9 dimensional algorithm, so, 
// we should not need to worry too much about directional artifacting
// since we're not only placing the tiles based on it's local position
// but also it's world factors and probabilities/weights

// probability: a tile's individual chance to be chosen
// weight: the likelyhood to see a tile given higher (or specific value) factors
// (i can't tell which, which means we need a weight value modifier)
// 1 on humidity could be full humidity = full probability...
// or higher humidity = higher probability
// but i think i like the idea of distance based
// 1 on humidity means it's full probability at 1 humidity, lower as it falls off?


// this is half of the algorithm, this blends probabilities over a space...
// the full space... how will we map probabilites to the transition section?

// todo: figure out a visual/data stablization
// we need the spaces to match the ranges
// what i mean is to say in a space of 

// -1 to 1, we need to be able to single out -.1 to .1 to use to blend
let value = 0;
let outout = 0;
//(something to note about cw: the value is inverse space )
// a value of 10 makes the cw work in .1 space. (100 is .01)
// this is because we're working in whole 1 range, and 1 to 10, is .1 to 1 
// this is value expansion based forming. how can we learn more about value expansion?

outout += (/* desert * */ cw(-1, value))
outout += (/* desertPlainsTransition * */ cw(0, value))
outout += (/* plains * */ cw(1, value));

//this outout is doing a form of gradient, a form of falloff system for weights
// it's a blending tech for values that need a way to becomes less rare away from
// a point or threshold. biomes are a collection of points along 8 dimensiions
// these dimensions are physical dymensions so there are coordinates in all space

//(i will fully admit that i'm pushing these to get my daily streak to stay while my testing device is not funcitonal)

// when i figure out how to blend one dimension, i'll blend two dimensions
// then i will blend all dimensions

// a topic we need to consider is how we can make it consistant
// to improve working with this kind of space
// we need a good understanding of how this space works in multiple ways
// so we can form systems around this issue

//on another note, we've made a cool tech that we can use as a proximity sensor
//how can we use it as proximity detector? how do we cw in multiple dimensions?


let dimensions = new Map([["x", 1], ["y", 2]]);
let valueDimensions = new Map([["x", 1], ["y", 2]]);
function multiDimensionalCW(dimensions, valueDimensions) {
	// should it be multiplicative? no
	//(we should compress the value by number of dimensions)
	let len = dimensions.size;
	let val = 1;
	//one potential issue here is that we are not normalizing the radius of the dims
	for (let [dim, val] of dimensions) {
		let valDim = valueDimensions.get(dim) 
		if (valDim !== undefined) //no value, no multiplication
			val *= (cw(val, valDim)/len) 
	}
	return val
}
function multiDimensionalW(dimensions, valueDimensions) {
	// should it be multiplicative? no
	//(we should compress the value by number of dimensions)
	let len = dimensions.size;
	let val = 0;
	//one potential issue here is that we are not normalizing the radius of the dims
	for (let i = 0; i > len;i++){
		val *= (cw(dimensions[i], valueDimensions[i])) 
	}
	return val
}
let outa = multiDimensionalCW(dimensions, valueDimensions)

// prepare two dimensions
let la2d = [2, 5]
// prepare two values
let lav2d = [0, 5]
// expect .5 output// no we should have 0 as output... which?!
let out = multiDimensionalW(la2d, lav2d);

// thinking of .5 as output comes from the idea of total weighting
// however, 0 as output would have a different tech
// think if we are hot, but dry, we won't have wet plants
// so removing the wet plants from the equation is important
// now, as i think this way i can't imagine a single reason to do the .5 additive style

// what if we pomni xddcc 
// what if we add nano pomni
// nano: pomi

// so we need to account for the falloff strength
// |(value + offset) - target| + outerOffset
// (|(value+offset)|-target + outerOffset)
// neither of these control falloff...

//so imagine this, sweet cologns, perfumes, and even clothes washing stuff
//like imagine, pancake or vanilla or cinamon flavor soaps and deturgents
// sweet deoderants... a cool idea...

// n0 abi pomi o2 vampi 
// play around with spaces, like, line intersections

//like, form two lines along some axis
//do axis checking to see where along the axis we are
//we need to convert that space also along falloff space
