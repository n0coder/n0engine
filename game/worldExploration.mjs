import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { ticks } from "../engine/core/Time/n0Time.mjs";
import { p } from "../engine/core/p5engine.ts";
import { worldGrid } from "../engine/grid/worldGrid.ts";
import { gameH, gameW } from "../engine/n0config.mjs";
import { inverseLerp, lerp } from "../engine/n0math/ranges.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { findPath } from "./nanoai/research/n0Pathfinder.mjs";
import { Wall } from "./world/props/wall.mjs";
import { startGlobalEntities } from "../engine/core/globalEntities.mjs"
import { Camera, camera } from "../engine/core/Camera/camera.mjs";
import Alea from "alea";
import { WorldGenerator } from "./world/wave/worldGen/worldGenerator.mjs";
let n0 = new Nanoai("n0", 0, 0);
let n1 = new Nanoai("n1", 2, 0);
let n2 = new Nanoai("n2", 4, 0);
globalThis.n0 =[n0,n1,n2];
globalThis.worldGrid = worldGrid;
[[5,5], [6,5], [7,5], [8,5], [9,5]].map(([x,y]) => 
	worldGrid.setTile(x, y, new Wall(x,y)))
//
cosmicEntityManager.addEntity(camera);
camera.follow(n0)
//let water = new Water(7, 7)
//worldGrid.setTile(7, 7, water)
/*
n0.brain.do("follow", water)
n0.brain.do("walk", 15,11);
n0.brain.do("follow", water)
*/

function* edgeCast(radius) {
	let startQueue = [], offsets = [], visited = new Set();
	for(let i = -radius; i <= radius; i++) {
		for(let o = -radius; o <= radius; o++) {
			if (Math.sqrt(i*i + o*o) < radius) {
				startQueue.push([i,o]);
				visited.add(`${i}, ${o}`);
			}
		}
	}
 
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
	for (let [i,o] of startQueue) {
		for(let [a,b] of directions) {
			let x = i+a, y = o+b;
			if (!visited.has(`${x}, ${y}`)) {
				yield [x, y];
				visited.add(`${x}, ${y}`);
			}
		}
	}
 }
 

/*
n0.brain.do("ping", (n)=>n.vx=-1);
n0.brain.do("search", search, 6, 120, onFound)
n0.brain.do("ping", (n)=>n.vx=1);
n0.brain.do("search", search, 6, 120, onFound)
n0.brain.do("ping", (n)=>{n.vy =-1, n.vx=0});
n0.brain.do("search", search, 6, 120, onFound)
n0.brain.do("ping", (n)=>{n.vy =1, n.vx=0});
n0.brain.do("search", search, 6, 120, onFound)
*/
//coming up with a search space tech

// *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*,
// still nothing? 
// try the ringcast on chunks to find a chunk outside the radius
// walk to the chunk and try again
// either limit this to a further radius, or until the nano gets tired
// even better, mark the state of the search for later so the nano can start the search from their pre existing knowledge
// what if we mark unexplored chunks in their group radio channel and have them randomly select one when starting to search again?
// logically the world won't change on it's own, so you can reasonably expect a continuation tech to work like this
console.log(12%4)
console.log(12 / 4)
console.log(4/12)
function* ringCast(cx, cy, radius = 3, visited, onVisited) {


	//radius should be in grid space
	let chunkSize = worldGrid.chunkSize;
	let gridSize = worldGrid.gridSize
	//radius = gridSize*2.5
	let c = worldGrid.gridToChunkPoint(cx, cy);
	let cc = worldGrid.chunkToGrid(c.x, c.y);
	//var (cx, cy]
	cx = cc.x, cy = cc.y
	radius = (Math.round((radius) / 2) * 4); //delete odd numbers (removes odd even position desync)
	let startQueue= new Map();
	if ( visited === undefined ) visited = new Set(); //allow a shared visited tech
			
	for (let i = -radius -gridSize; i <= radius+gridSize; i += gridSize) {
		for (let o = -radius-gridSize; o <= radius+gridSize; o += gridSize) {
			let xy = worldGrid.gridToChunkPoint(i, o);
			let usy =[cx + xy.x, cy+ xy.y];
			if (visited.has(`${usy[0]}, ${usy[1]}`)) continue;
			let x = i + cx, y = o + cy;
			let mag = Math.sqrt(i * i + o * o)
			//var ox = worldGrid.gridToChunkPoint(i, o);
			if (mag < radius / 2) {
				onVisited?.(usy[0], usy[1]);
				visited.add(`${usy[0]}, ${usy[1]}`); //mark this as visited, since we only care about their neighbors and not themselves
				startQueue.set(`${usy[0]}, ${usy[1]}`, [usy[0], usy[1]])
				//yield [usy[0],usy[1]];
			}
		}
	}
	//console.log(startQueue)
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
	for (let [oxz, [i,o]] of startQueue) {
		for(let [a,b] of directions) {
			let x = i+(a*chunkSize), y = o+(b*chunkSize);
				if (!visited.has(`${x}, ${y}`)) {
					yield [x, y];
					//visited.add(`${x}, ${y}`);
				}
			}
		}
}

function dotFov(x, y, tx, ty, vx, vy, fov) {
    // Calculate the vector from your position to the target
    var dx = tx - x;
    var dy = ty - y;

    // Normalize the direction vector
    var mag = Math.sqrt(dx * dx + dy * dy);
    var nx = dx / mag;
    var ny = dy / mag;

    // Calculate the dot product
    var dotProduct = nx * vx + ny * vy;
    
    // invert the dot, and drop it directly into the expected angle
    var inverseDot = inverseLerp(-1, 1, dotProduct)
    var angle = lerp(360, 0, inverseDot)
   
    //just like that simple use
    return angle <= fov;
}

nanoaiActions.set("searcho", function(condition, radius = 16, fov = 120, out) {
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
	return {
		iterator: null, results: [], radius, fov, //(((2*3.1415926)/360)*fov), 
		work(nano) {
			if (this.iterator === null) 
				this.iterator = this.radialArcSearch(condition, nano, this.radius, this.fov)			
			var info = this.iterator.next(); //we're rolling a form of 
			if (info.value !== undefined)
				this.results.push(info.value);
			if (info.done) out?.(this.results);
			
			return !info.done; //false = exit, false = notdone... 
		}, 
		radialArcSearch: function* (condition, nano, radius, fov) { //we iterate through the results we find
			let cx = Math.round(nano.x), cy = Math.round(nano.y); 
			let queue = [[Math.round(cx), Math.round(cy)]], visited = new Set()

			while (queue.length > 0) {
				let [x, y] = queue.shift();
				let tile = worldGrid.getTile(x, y);

				if (condition?.(tile, x, y, cx, cy)) 
					yield({tile, x,y});				
				visited.add(`${x}, ${y}`);

				for (let [dx, dy] of getNeighbors(x, y, visited, queue)) {		
					let dot = dotFov(cx, cy, dx, dy, nano.vx, nano.vy, fov)
					let dist = this.distance(dx, dy, cx, cy) <= radius
					if (dot&&dist) {
						queue.push([dx, dy, dot, dist]);	
					}
				}				  
			}
			function* getNeighbors(a, b, visited, queue) { 
				let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
				for(var [i, o] of directions) {
					let x = i+a, y = b+o;
					if (!visited.has(`${x}, ${y}`) && !isInQueue(queue, x, y)) //we can handle preventing if a neighbor is already visited here
						yield [x, y]
				}
			}
			function isInQueue(queue, dx, dy) {
				return queue.some(([x, y]) => x === dx && y === dy);
			}
		},
		normalize(x,y) {
			var mag = Math.sqrt(x*x+y*y);
			return [x/mag, y/mag, mag];
		  },
		  
		  dotProduct(vec1, vec2) {
			return vec1[0]*vec2[0] + vec1[1]*vec2[1];
		  },
		 distance(x1, y1, x2, y2) {
			let dx = x2 - x1;
			let dy = y2 - y1;
			return Math.sqrt(dx * dx + dy * dy);
		 }

	}
})

nanoaiActions.set("radialSearch", function (search, onFound) {
	return {
		moveNext: null, generator: null, next: null,
		work(nano) {
			if (this.generator === null) this.generator = this.rotate(nano);
			//n0.brain.do("dance2"); //next frame do a dance
			this.next = this.generator.next() //describing what happens next frame 
			let waitAFrame= (( this.moveNext===null || this.moveNext === true) && (this.next != null && !this.next.done) );
			console.log({mn: this.moveNext, n:this.next, waitAFrame})
			return waitAFrame; //true = keep going (this is like a really sophisticated do while system)
		}, id: 0,
		rotate: function*(nano) {
			for (let direction of ["left", "up", "right","down"]) { //each direction, we hook into an activity that turns the nano to this direction, searches then pulls hook
				nano.brain.doBefore(this, "hook", (hook, marker) => { //do before (this) action completes *basically saying no actually i need this to happen right now*
					nano.brain.doBefore(marker, "look", direction) //before we can exit the hook... we look down, search
					nano.brain.doBefore(marker, "search", search, nano.sightRadius, nano.fov, onFound)
					nano.brain.doBefore(marker, "pull", hook) //then exit it; but not before pinging what happens as it falls back into the "radial search" action
					nano.brain.doBefore(marker, "ping", ()=>{this.moveNext = true; console.log(this)}) //ping that we're ready to move onto the next stage
				}) 
				yield; //we yield to say we can do another round
			}
		}

	}
}) 
console.log(Math.sqrt(2)*2)
console.log(Math.sqrt(1))

//n0.brain.do("walk", 0, 0)			
//n0.brain.do("exploreSearch")
//n0.brain.do("walk", 7 + 8, 7)
/*
n0.brain.do("hook", (hook, marker) => {
	let x = n0.x, y = n0.y, tx = 7, ty = 7, vx = n0.vx, vy = n0.vy, fov = n0.fov; 
	
	n0.brain.doBefore(marker, "look", "up")
	n0.brain.doBefore(marker, "ping", () => console.log(dotFov(n0.x, n0.y, tx, ty, n0.vx, n0.vy, fov)))
	n0.brain.doBefore(marker, "wait",.5) 
	n0.brain.doBefore(marker, "look", "right")
	n0.brain.doBefore(marker, "ping", () => console.log(dotFov(n0.x, n0.y, tx, ty, n0.vx, n0.vy, fov)))
	n0.brain.doBefore(marker, "wait",.5) 
	n0.brain.doBefore(marker, "look", "down")
	n0.brain.doBefore(marker, "ping", () => console.log(dotFov(n0.x, n0.y, tx, ty, n0.vx, n0.vy, fov)))
	n0.brain.doBefore(marker, "wait",.5) 
	n0.brain.doBefore(marker, "look", "left")
	n0.brain.doBefore(marker, "ping", () => console.log(dotFov(n0.x, n0.y, tx, ty, n0.vx, n0.vy, fov)))
	n0.brain.doBefore(marker, "pull", hook)
})
*/
let search = (tile) => {
	
	return (tile && tile["waterLevel"] !== undefined)
};
//search = () => true;
/*
n0.brain.do( "search", search, 8, 360, (results) => {
	console.log(results); 
	if (results.length > 0)
	n0.brain.do("spin", 10, 12);
})
*/
/*
n0.brain.do("radialSearch", search, (results) => {
	console.log(results); 
	if (results.length > 0)
	n0.brain.do("spin", 10, 10);
});
*/






function makeRingCaster() {
	let points = new Map();
	return {
	visited: new Set(), points,
	[Symbol.iterator]: ()=>points.values(),
	cast(x, y, radius) {
		let cast = ringCast(x, y, radius, this.visited, (i, o)=> this.points.delete(`${i}, ${o}`));
		for (let usy of cast) 
			this.points.set(`${usy[0]}, ${usy[1]}`, usy);	
		return this;	
	},
	delete(x, y) {
		this.points.delete(`${x}, ${y}`)
	}
	}
}
let ringCaster = makeRingCaster();

//ringCaster.cast(n0.x, n0.y, n0.sightRadius); //casts a ring around the sight radius


nanoaiActions.set("exploreSearch", function (onFound) {
	return {
		ringCaster: makeRingCaster(),
		work(nano) {
			
			for (let r of ringCaster.cast(nano.x, nano.y, nano.sightRadius)) {
				nano.brain.doAfter(this, "hook", (hook, marker) => { //do before (this) action completes *basically saying no actually i need this to happen right now*
					nano.brain.doBefore(marker,  "walk", r[0], r[1]) //before we can exit the hook... we look down, search
					nano.brain.doBefore(marker,"ping", () => ringCaster.delete(r[0],r[1]))
					nano.brain.doBefore(marker, "spin", 1, 10) //ping that we're ready to move onto the next stage
					nano.brain.doBefore(marker, "pull", hook) //then exit it; but not before pinging what happens as it falls back into the "radial search" action
				}) 
			}
		}		
	}
})
//n0.brain.do("exploreSearch")
export class Visualizer {
	constructor (nano) {
		this.gridSize = worldGrid.gridSize;
		this.radi = worldGrid.gridSize
		this.t = 0;
		this.renderOrder = -5;
		this.nano = nano, this.nanox = nano.visualX, this.nanoy = nano.visualY;
		this.a = Alea("XD")
		this.ra = this.a.exportState()
		this.visited = new Set();
		//this.ring = ringCast(3,, this.visited)
		//ringCaster.cast(n0.x, n0.y, n0.sightRadius)
		//this.r = [...ringCast(n0.x, n0.y, this.radi * 2.5, this.visited)]
		//console.log(this.r);
	}
	draw() {
		let sm = inverseLerp(-1,1, Math.sin(ticks*.1));
		this.a.importState(this.ra) 
		this.drawGrid(p, this.a, worldGrid.gridSize, worldGrid.chunkSize);		
	}
	drawGrid(p, a, spacing = 2, chunkSize = 1) {
		// Calculate the total number of dots in the width and height
		let v = 2.5;
		let cs = spacing * chunkSize
		/*
    for (let i = 0; i <= gameW; i+= spacing) {
		for (let o = 0; o <= gameH; o += spacing) {
			
            // Calculate the x and y coordinates of the dot
            const x = Math.floor(i / cs)*cs;
            const y = Math.floor(o / cs)*cs;

			p.fill(111, 255, 177, 100)
            // Draw the dot
			p.ellipse(x, y, spacing * .5);
			p.push()
			p.fill(111, 255, 255)
			p.ellipse(i, o, spacing*.25);
			p.pop()
        }
	}
		*/
		p.fill(255, 111, 255,45)
		p.ellipse(this.nanox, this.nanoy, 2*2.5* this.radi* chunkSize)
		for (let r of ringCaster) {
			p.push()
			p.fill(255, 111, 255)
			p.ellipse((r[0]*spacing), (r[1]*spacing), spacing*.4);
			p.pop()
	}
	
}

}
console.log((36)/(8*4))
//console.log(([[2,5], [2,2]]).find(a => [2,6]));
//let bfs = new Visualizer(n0);
//cosmicEntityManager.addEntity(bfs);




function searchSpace(nano, condition, radius, fov) {
	let visited = new Set(), chunksVisited = new Set(), results = [];
	/* what if nanoais... did the logic... */
// ? /*i'ma leave this active as it will cause logs to appear in the console*/
	//n0.brain.do("turn", "left") 
	
	//not going to make a "do" but not if "do"
	//logically unsound
	//we could do something else
	let found = false;
	
	

	/*
		what if we do some form of generator state machine
		simpler way to write all this
		{
		    state: 'wait',
		    "wait": ()=> {},
		    "radialBFS": ()=> {},
		    "ringChunkSearch": ()=> {}
		}
	*/

	// ## IMPORTANT INFO: /* in order for the tech to work properly we should turn this into a generator function */
	/* the reason generator functions are so useful here, is that without them we can not prevent the function from finishing without it */

    //like yeah, we could write this tech without it, but it's probably clearer if we can yield any time we hit an important point
	//imagine yielding to pause execution while the nano does work, we also need to take state machine techs into account...

	//let radialArc = radialArcSearch(condition, visited, nano.x, nano.y, nano.vx, nano.vy, radius, fov);
	//let result = radialArc.next()
	//if (result.value !== undefined) {
		//results.push(result.value);
	//} 
	//no items found, the search completes, but we have not found anything
	//if (result.done && result.value === undefined && results.length === 0) {
		//
//}
	//console.log()
	// we will need two systems (3?)
	// radial bfs
	// rotate 4 times to the right
    // ringCast bfs

	// do radial bfs, if nothing is found, ringcast to find a new chunk
	

}
//searchSpace(n0, search, 6, 120);

//2025 april effort to make groupRadialArcBFS

/*
the first thing we need to prioritize is working with BFS rules outside the work function
*/
export function distance(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
 }
//visited is outside search function, to allow multiple searches to contribute
let bxs = ()=> ({ visited: new Map(), visitedChunks: new Set(),
	tile(x,y){ return {x,y, tile:()=>worldGrid.getTile(x,y)}},
	ping(nano,xi, yo, out) {
        nano.brain.do("walk", xi*worldGrid.chunkSize,yo*worldGrid.chunkSize)
		nano.brain.do("ping", ()=>{
		let aosi = 1;
		var x = xi*worldGrid.chunkSize, y = yo*worldGrid.chunkSize;
        for (const [_, pos] of this.visited) {
			p.fill(pos.color.r, pos.color.g, pos.color.b)
			p.circle(pos.x*worldGrid.gridSize+(worldGrid.gridSize/2),pos.y*worldGrid.gridSize+(worldGrid.gridSize/2), worldGrid.gridSize)
		}
		let color = {r: Math.floor(Math.random()*255), g: Math.floor(Math.random()*255), b: Math.floor(Math.random()*255)}
        let r = worldGrid.chunkSize * Math.SQRT2
        //r *= Math.SQRT2;
        let queue = [], ox = x, oy = y
		var [x,y] = worldGrid.alignGridPosition(x,y)
		var [x,y] = worldGrid.alignPositionChunk(x,y); //chunk coords world space

		let bop = (xo,yo)=>{
				
			let v = this.visited.get(`${xo}, ${yo}`)
			//console.log(v)
			let d = Math.floor(distance(ox,oy,xo,yo))
			if (v===undefined &&  d < r)
				queue.push(this.tile(xo,yo))
			
		}
		bop(x, y); bop(x-1, y); bop(x+1, y); bop(x, y-1); bop(x, y+1);
		//if (this.visited.get(`${x}, ${y}`)) return;
        while (queue.length > 0) {
			aosi++;
			var {x,y,tile} = queue[0]
			queue.shift()
		    var [x,y] = worldGrid.alignGridPosition(x,y)
            
            //console.log({x,y,cx,cy, dx: cx-x, dy:cy-y})
            
		   
			if (this.visited.get(`${x}, ${y}`)) { continue; };
			//why is bop only exploring tiles that are diagonal (x+1, y+1) etc...
            bop(x-1, y); bop(x+1, y); bop(x, y-1); bop(x, y+1);
			out(tile())
	        //console.log({x,y,tile: ;
			this.visited.set(`${x}, ${y}`, {x,y, color})
	    }
	})

		//if we did not we check it then
		//calculate neighbor distance to starting point
		//add not visited neighbors within radius
	}

})
let bxo = bxs()
/*
bxo.ping(n0, 2,6, (i)=>{return true})
bxo.ping(n0, 12,12, (i)=>{ return true})
bxo.ping(n0, -2,2, (i)=>{ return true})
bxo.ping(n0, -12,12, (i)=>{ return true})
bxo.ping(n0, 12,-12, (i)=>{ return true})
bxo.ping(n1, 2,2, (i)=>{ return true})
bxo.ping(n1, 2,4, (i)=>{return true})
bxo.ping(n2, 4,2, (i)=>{ return true})
bxo.ping(n2, 2,4, (i)=>{ return true})
*/
n0.brain.do("dance");

n0.brain.do("ping-", () => {
	let bopo = 0;
	console.log(`running a rountine bopo ${bopo}`)
    if (bopo === 2) return false;
    n0.brain.doNow("dance")
	bopo++;
	return true;
})

nanoaiActions.set("bopo", function () {
	return {  
		start() {
			this.bopo = 0;
		},
		work() {
			console.log(`running a rountine bopo ${this.bopo}`)
			if (this.bopo === 2) return false;
			n0.brain.doNow("dance")
			this.bopo++;
			return true;
		}
	}
})
//n0.brain.do("bopo")
// it's currently unclear that the ping tech is a nano search tech

// here i prototype thoughts
// imagine we set up a reciever function
// the idea is we run this on all visited tiles, 
// if we return true, it is the tile we want
// so we will log the tile internally? have the nano pick something up or do something?
// the callback is current tile found by current nano
let bxo2 = bxs((tile, nano)=>{ nano.brain.do(/* something? */); return true; })

// ok so instead of pinging we run the bxo as an action, or we run xbo as part of an action

// bxo as an action, this is extremely unclear, we don't even know if this syntax is valid
// making the syntax valid would require a massive potentially breaking change to the core nano ai
//n0.brain.do(bxo2, 0, 0) //pass in bxo2 with extra params/args is bad.

n0.brain.do("search", 0, 0, bxo2) //search at 0, 0 on the bxo2 shared object
// imagine we want to search single spots so we could init a brand new bxo but we don't have a default callback
// which is aok. we can pass the callback instead
n0.brain.do("search", 0, 0, (tile, nano)=> { /* do something */ return true; })
// now i'm identifying a potential issue with the current implementation
// say we want the nano to walk to a point mid search when they find something worth looking at,
// if we interupt the search flow, 
// the nano will start at the beginning of their task again, which could reinit the entire setup

// one solution could be to use a generator function, really this is why those exist
// but there are more issues with the current nanoai action system. 
// like we identified moments ago, actions being interupted partially breaks init
// a notable issue that's common in games, is when an ai goes back to following some path, 
// it has to trace back to the previous point even if it's already past it

// we are going to add another control flow concept

// this is a nanoai action
nanoaiActions.set("paint", function(canvas) {
	// first init space
    return { work(){ /*
		 what to do every frame, 
		 more often than not, 
		 we return false to dequeue and not run another frame
		 which opens up the ability to naturally not consider repeating snippits
		 even to forget we're working with data outside the closure
		 what that means is expecting a character to be following a path, 
		 keeping track of its position in the path 
		 (not x and y but the index of the path array) and walking towards that
		 but gets interupted, teleported 20000 tiles in some direction
		 will still try to walk to that point, when it should recalculate the pathing

		 having noted another case where we run into potential issues i say we target making a feature
		 which runs when we shift back to an action, it will be optional because not every action needs the tech
		 */ } }
})

//start