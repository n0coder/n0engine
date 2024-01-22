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
import { startGlobalEntities } from "../engine/core/globalEntities.mjs"
import { camera } from "../engine/core/Camera/camera.mjs";
import Alea from "alea";
let n0 = new Nanoai("n0", 12, 12);
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
console.log(Math.PI)
console.log(Math.PI/Math.SQRT2)
console.log(Math.sqrt(2.25))
console.log(Math.sqrt(2.221))
console.log(Math.sqrt(2)*(3.1415926 / 2))
console.log(3.1415926 / 2)
console.log((3.1415926 / 2)*(3.1415926 / 2))
export class Visualizer {
	constructor (nano) {
		this.gridSize = worldGrid.gridSize;
		this.radi = 15
		this.t = 0;
		this.renderOrder = -5;
		this.nano = nano;
		this.a = Alea("XD")
		this.ra = this.a.exportState()
	}
	draw() {
		let sm = inverseLerp(-1,1, Math.sin(ticks*.1));
		this.a.importState(this.ra) 
		this.drawGrid(p, this.a, this.radi, lerp(1, this.radi*2.25, sm));		
	}
	drawGrid(p, a, spacing = 2, dotSize = 1) {
    // Calculate the total number of dots in the width and height

    // Iterate over each dot
    for (let i = 0; i <= gameW; i+= spacing) {
		for (let o = 0; o <= gameH; o += spacing) {
			
            // Calculate the x and y coordinates of the dot
            const x = i+(1*a.next()*spacing);
            const y = o+(1*a.next()*spacing);

            // Draw the dot
            p.ellipse(x, y, dotSize, dotSize);
        }
    }
}

}

//console.log(([[2,5], [2,2]]).find(a => [2,6]));
let bfs = new Visualizer(n0);
cosmicEntityManager.addEntity(bfs);

let o =[0, 1,2,3,4,5,6,7,8,9,10].map(i => (Math.round((i)/2)*2))
console.log(o);


//coming up with a search space tech

// *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*, *search*, *rotate 90*,
// still nothing? 
// try the ringcast on chunks to find a chunk outside the radius
// walk to the chunk and try again
// either limit this to a further radius, or until the nano gets tired
// even better, mark the state of the search for later so the nano can start the search from their pre existing knowledge
// what if we mark unexplored chunks in their group radio channel and have them randomly select one when starting to search again?
// logically the world won't change on it's own, so you can reasonably expect a continuation tech to work like this


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

nanoaiActions.set("search", function(condition, radius = 16, fov = 120, out) {
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
nanoaiActions.set("exploreSearch", function (onFound) {
	return {
		ring: null, next: null, visited: new Set(), 
		work(nano) {
			let origin = worldGrid.gridToChunkPoint(nano.x, nano.y);
			if (this.ring === null) this.ring = this.ringCast((Math.round((nano.sightRadius)/2)*4), worldGrid.chunkSize, this.visited)
			this.next = this.ring.next() //describing what happens next frame 
			let pos = this.next?.value
			if (pos !== undefined && !this.next.done) {
				//let xy = worldGrid.gridToChunkPoint(pos[0], pos[1]);
				let xx = worldGrid.chunkToGrid(origin.x + pos[0], origin.y + pos[1])
				console.log(xx);
				nano.brain.doBefore(this, "walk", xx.x, xx.y) //the ringcast gives offsets based on origin...
				nano.brain.doBefore(this, "spin", 1, 10) //this is really cute she walks to a location, twirls then moves onto the next task
			}
			let waitAFrame= ( (this.next != null && !this.next.done) );
			return waitAFrame;
		},
		ringCast: function*(radius = 3, chunkSize, visited) {
			let startQueue= [];
			if ( visited === undefined ) visited = new Set(); //allow a shared visited tech
			for(let i = -radius-chunkSize; i <= radius+chunkSize; i+=chunkSize) {
				for (let o = -radius - chunkSize; o <= radius + chunkSize; o += chunkSize) {
					if (Math.sqrt((i * i + o * o)) < radius / 2) {
						if (visited.has(`${i}, ${o}`)) continue;
						visited.add(`${i}, ${o}`); //mark this as visited, since we only care about their neighbors and not themselves
						startQueue.push([i, o])
						//yield [i, o];
					}
				}
			}
			let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
			for (let [i,o] of startQueue) {
				for(let [a,b] of directions) {
					let x = i+(a*chunkSize), y = o+(b*chunkSize);
					if (!visited.has(`${x}, ${y}`)) {
						yield [x, y];
						visited.add(`${x}, ${y}`);
					}
				}
			}
		}
	}
})
//n0.brain.do("walk", 0, 0)			
//n0.brain.do("exploreSearch")
n0.brain.do("walk", 7+8, 7)
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

n0.brain.do("radialSearch", search, (results) => {
	console.log(results); 
	if (results.length > 0)
	n0.brain.do("spin", 10, 10);
});

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


