import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { ticks } from "../engine/core/Time/n0Time.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { gameH, gameW } from "../engine/n0config.mjs";
import { inverseLerp, lerp } from "../engine/n0math/ranges.mjs";
import { Nanoai } from "./nanoai/nanoai.mjs";
import { nanoaiActions } from "./nanoai/nanoaiActions.mjs";
import { findPath } from "./nanoai/research/n0Pathfinder.mjs";
import { Wall } from "./world/props/wall.mjs";
import { Water } from "./world/props/water.mjs";

let n0 = new Nanoai("n0", 7, 3);
globalThis.n0 =n0;
[[5,5], [6,5], [7,5], [8,5], [9,5]].map(([x,y]) => 
	worldGrid.setTile(x, y, new Wall(x,y)))
let water = new Water(7, 7)
worldGrid.setTile(7, 7, water)
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
 

function* bfx(start, getNeighbors, matchCondition) {
    let queue = [start], visited = new set()
    while (queue.length > 0){
        let point = queue.shift()
        if (matchCondition?.(point)) //but this is similar to yielding... OH BUT NOT USED IN THE SAME PLACE
        	yield point;
        visited.add(`${point.x}, ${point.y}`);

		for (let neighbor of getNeighbors(point, visited)) {
			//if neighbor is not visited, is not already in the queue, and has neighbors
			if (this.distance(start.x, start.y, neighbor.x, neighbor.y) < 2) //some reason to exit the algorithm
				queue.push(neighbor)
		}
    }
}


nanoaiActions.set("search", function(condition, radius = 16, fov = 120, out) {
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
	return {
		iterator: null, results: [], radius, fov: (((2*3.1415926)/360)*fov), 
		work(nano) {
			if (this.iterator === null) 
				this.iterator = this.radialArcSearch(condition, nano.x, nano.y, nano.vx, nano.vy, this.radius, this.fov)			
			var info = this.iterator.next(); //we're rolling a form of 
			if (info.value !== undefined)
				this.results.push(info.value);
			if (info.done) out?.(this.results);
			
			return !info.done; //false = exit, false = notdone... 
		}, 
		radialArcSearch: function*(condition, cx, cy, vx, vy, radius, fov) { //we iterate through the results we find
			let queue = [[cx,cy]], visited = new Set()

			while (queue.length > 0) {
				let [x, y] = queue.shift();
				let tile = worldGrid.getTile(x, y);
				if (condition?.(tile)) 
					yield({tile, x,y});				
				visited.add(`${x}, ${y}`);

				for (let [dx, dy] of getNeighbors(x, y, visited, queue)) {				
					if (this.distance(dx, dy, cx, cy) <= radius) {
						let xMod = ((vx < 0) ? -1 : 1);
					  	let angleDiff = Math.abs(Math.atan2( dy-cy, (dx-cx)*xMod) - Math.atan2(vy, vx * xMod ));
					  	if (angleDiff <= fov / 2) 
							queue.push([dx, dy, dx-cx, dy-cy]);	
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
export class Visualizer {
	constructor (nano) {
		this.gridSize = worldGrid.gridSize;
		this.radi = 8
		this.t = 0;
		this.renderOrder = -5;
	}
	draw() {
		let ivn = inverseLerp(-1, 1, p.sin(ticks*.1));
		let grai = this.gridSize*this.radi*ivn
		let x = this.gridSize*8, y = this.gridSize*8
  for(let i = 0; i <= gameW; i+= this.gridSize) {
    for(let o = 0; o <= gameH; o+= this.gridSize) {
      let vx = i-x;
      let vy = o-y;
	  let lak = i  % (worldGrid.chunkSize * worldGrid.gridSize);
	  let laky = o  % (worldGrid.chunkSize * worldGrid.gridSize);
      
        p.fill(255,111,111)
        p.ellipse(i,o, this.gridSize*lerp(.3, .1, ivn));
       
	  if ((Math.sqrt(vx*vx + vy*vy) < grai) && (lak ==0 && laky == 0)) {
        p.fill(111,255,111)
        p.ellipse(i,o, this.gridSize*lerp(.0, .3, ivn));
      }
    }
  }
  p.fill(111,255,111, lerp(111, 22, ivn))
  p.ellipse(x, y, grai*2);
	}
}

//console.log(([[2,5], [2,2]]).find(a => [2,6]));
let bfs = new Visualizer(n0);
cosmicEntityManager.addEntity(bfs);




let radialArcSearch = function*(condition, visited, x,y, vx, vy, radius, fov) {
	let queue = [[x, y]]
	while (queue.length > 0) {
		let [nx, ny] = queue.shift();
		let tile = worldGrid.getTile(nx, ny);
		if (condition?.(tile)) 
			yield tile
		visited.add(`${nx}, ${ny}`);
		for (let [dx, dy] of getNeighbors(x, y, visited, queue)) {				
			if (distance(dx, dy, x, y) <= radius) {
				let xMod = ((vx < 0) ? -1 : 1);
				let angleDiff = Math.abs(Math.atan2( dy-y, (dx-x)*xMod) - Math.atan2(vy, vx * xMod ));
				if (angleDiff <= fov / 2) 
					queue.push([dx, dy, dx-x, dy- y]);	
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
	function distance(x1, y1, x2, y2) {
		let dx = x2 - x1;
		let dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	 }

}

//coming up with a search space tech

// *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*,
// still nothing? 
// try the ringcast on chunks to find a chunk outside the radius
// walk to the chunk and try again
// either limit this to a further radius, or until the nano gets tired
// even better, mark the state of the search for later so the nano can start the search from their pre existing knowledge
// what if we mark unexplored chunks in their group radio channel and have them randomly select one when starting to search again?
// logically the world won't change on it's own, so you can reasonably expect a continuation tech to work like this

nanoaiActions.set("radialSearch", function (onFound) {
	return {
		moveNext: false, generator: null, next: null,
		work() {
			if (this.generator === null) this.generator = this.rotate();
			n0.brain.do("dance2"); //next frame do a dance
			this.next = this.generator.next() //describing what happens next frame 
			let waitAFrame= (( this.moveNext===null || this.moveNext === true) && (this.next != null && !this.next.done) );
			return waitAFrame; //true = keep going (this is like a really sophisticated do while system)
		}, id: 0,
		rotate: function*() {
			for (let direction of ["left", "up", "right","down"]) { //each direction, we hook into an activity that turns the nano to this direction, searches then pulls hook
				n0.brain.doBefore(this, "hook", (hook, marker) => { //do before (this) action completes *basically saying no actually i need this to happen right now*
					n0.brain.doBefore(marker, "look", direction) //before we can exit the hook... we look down, search
					n0.brain.doBefore(marker,"search", search, 6, 120, onFound)
					n0.brain.doBefore(marker, "pull", hook) //then exit it; but not before pinging what happens as it falls back into the "radial search" action
					n0.brain.doBefore(marker,"ping", ()=>{this.moveNext = true; console.log(this)}) //ping that we're ready to move onto the next stage
				}) 
				yield; //we yield to say we can do another round
			}
		}

	}
}) 

n0.brain.do("radialSearch", (results)=> {
	console.log(results); 					
});
let search = (tile) => (tile && tile["waterLevel"] != null);

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

	let radialArc = radialArcSearch(condition, visited, nano.x, nano.y, nano.vx, nano.vy, radius, fov);
	let result = radialArc.next()
	if (result.value !== undefined) {
		results.push(result.value);
	} 
	//no items found, the search completes, but we have not found anything
	if (result.done && result.value === undefined && results.length === 0) {
		//
	}
	console.log()
	// we will need two systems (3?)
	// radial bfs
	// rotate 4 times to the right
    // ringCast bfs

	// do radial bfs, if nothing is found, ringcast to find a new chunk
	

}
searchSpace(n0, search, 6, 120);




let radialArcBFS = function*(condition, cx, cy, vx, vy, radius, fov) { //we iterate through the results we find
	let queue = [[cx,cy]], visited = new Set()

	while (queue.length > 0) {
		let [x, y] = queue.shift();
		let tile = worldGrid.getTile(x, y);
		if (condition?.(tile)) 
			yield({tile, x,y});				
		visited.add(`${x}, ${y}`);

		for (let [dx, dy] of getNeighbors(x, y, visited, queue)) {				
			if (this.distance(dx, dy, cx, cy) <= radius) {
				let xMod = ((vx < 0) ? -1 : 1);
				  let angleDiff = Math.abs(Math.atan2( dy-cy, (dx-cx)*xMod) - Math.atan2(vy, vx * xMod ));
				  if (angleDiff <= fov / 2) 
					queue.push([dx, dy, dx-cx, dy-cy]);	
			}
		}				  
	}
	
}