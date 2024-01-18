import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { ticks } from "../engine/core/Time/n0Time.mjs";
import { p } from "../engine/core/p5engine.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
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



nanoaiActions.set("search", function(property, radius = 16, fov = 120, out) {
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
	return {
		iterator: null, results: [], radius, fov: (((2*3.1415926)/360)*fov), work(nano) {
			if (this.iterator === null) 
				this.iterator = this.radialArcSearch(property, nano.x, nano.y, nano.vx, nano.vy, this.radius, this.fov)			
			var info = this.iterator.next(); //we're rolling a form of 
			if (info.value !== undefined)
				this.results.push(info.value);
			if (info.done) out?.(this.results);
			
			return !info.done; //false = exit, false = notdone... 
		}, 
		radialArcSearch: function*(property, cx, cy, vx, vy, radius, fov) { //we iterate through the results we find
			let queue = [[cx,cy]], visited = new Set()

			while (queue.length > 0) {
				let [x, y] = queue.shift();
				let tile = worldGrid.getTile(x, y);
				if (tile && tile[property] != null) 
					yield({tile, x,y});				
				visited.add(`${x}, ${y}`);

				for (let d of directions) {
					let dx = x + d[0];
					let dy = y + d[1];					
					if (!visited.has(`${dx}, ${dy}`) && this.distance(dx, dy, cx, cy) <= radius && !this.isInQueue(queue, dx, dy)) {
						let xMod = ((vx < 0) ? -1 : 1);
					  	let angleDiff = Math.abs(Math.atan2( dy-cy, (dx-cx)*xMod) - Math.atan2(vy, vx * xMod ));
					  	if (angleDiff <= fov / 2) 
							queue.push([dx, dy, dx-cx, dy-cy]);	
					}
				}				  
			}
		},
		isInQueue(queue, dx, dy) {
			return queue.some(([x, y]) => x === dx && y === dy);
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
let onFound = (results)=> {
	console.log(results); 
	if (results.length > 0) {
		var {x,y} = results[0];
		n0.brain.do("debugLine", x*worldGrid.gridSize,y*worldGrid.gridSize, );
		n0.brain.do("dance2");
		n0.brain.do("walk", x, y)
		n0.brain.do("spin", 3, 6,.15)
		console.log("lining")
	}
}

n0.brain.do("ping", (n)=>n.vx=-1);
n0.brain.do("search", "waterLevel", 6, 120, onFound)
n0.brain.do("ping", (n)=>n.vx=1);
n0.brain.do("search", "waterLevel", 6, 120, onFound)
n0.brain.do("ping", (n)=>{n.vy =-1, n.vx=0});
n0.brain.do("search", "waterLevel", 6, 120, onFound)
n0.brain.do("ping", (n)=>{n.vy =1, n.vx=0});
n0.brain.do("search", "waterLevel", 6, 120, onFound)
export class BFSVisualizer {
	constructor (nano) {
		this.cache = new Map();
		this.gen = this.radiBFS(8,8, 8, "pathDifficulty");
		this.squareSize = 8
		this.cycle;
		this.nano = nano;
	}
	draw() {
		if (!this.cycle?.done) {
			this.cycle = this.gen.next();
			}
		for (const [key, {x,y,color}] of this.cache) {
			p.push();
			p.fill(color);
			p.rect(x*this.squareSize,y*this.squareSize,this.squareSize, this.squareSize);
			p.pop();
		}		
		this.drawRadialCone(p, [this.nano.visualX, this.nano.visualY],this.nano, 16*8, ((2*3.1415926)/360)*90, this.squareSize)
	}
	drawRadialCone(p, center, nano, radius, fov, sqSize) {
		const halfFOV = fov / 2;
		const numSquares = Math.ceil(radius / sqSize);
		let angle90 = (((2*3.1415926)/360)*120);
		let dir = [nano.vx, nano.vy];
		for (let i = -numSquares; i <= numSquares; i++) {
			for (let o = -numSquares; o <= numSquares; o++) {
				const dist = Math.sqrt(i * i + o * o);
				if (dist > numSquares) continue;
				
				let nano = this.nano;
				let mod = (nano.vx < 0) ? -1 : 1; 				
				let look_angle = Math.atan2(nano.vy, nano.vx*mod)
				let pixel_angle = Math.atan2(o, i*mod);
				if (Math.abs(pixel_angle - look_angle) > angle90/2) continue;
				
				

				const x = center[0] + i * sqSize;
				const y = center[1] + o * sqSize;
				p.rect(x, y, sqSize, sqSize);
			}
		}
	 }
	 
	radiBFS = function* (cx, cy, radius, property) {

		while (queue.length > 0) {
			
	 
			for (let d of directions) {
				var dx = x + d[0];
				var dy = y + d[1];
				var notVisited = !(visited.has(`${dx}, ${dy}`))
				var inRange = this.distance(dx, dy, cx, cy) <= radius;
				var inQueue = isInQueue(queue, dx, dy);

				let cvx = cx-dx; 
				let cvy = cy-dy;
				let nano = this.nano;
				let mod = (nano.vx < 0) ? -1 : 1; 				
				let look_angle = Math.atan2(nano.vy, nano.vx*mod)
				let pixel_angle = Math.atan2(cvx, cvy*mod);
				let condition = Math.abs(pixel_angle - look_angle) > angle120/2;
				if (condition) continue;

				if (notVisited && inRange && !inQueue) {
					// Add to queue and draw it
					queue.push([dx, dy, cvx, cvy]);
					if (!this.cache.get(`${x}, ${y}`))
						this.cache.set(`${x}, ${y}`,{x,y, color: [155, 155, 180, 177]});
				}
			}
	 		// Yield control back to caller
	 		yield;
		}
		function isInQueue(queue, dx, dy) {
			return queue.some(([x, y]) => x === dx && y === dy);
		 }
		 
		   
	 }
		
}

//console.log(([[2,5], [2,2]]).find(a => [2,6]));
//let bfs = new BFSVisualizer(n0);
//cosmicEntityManager.addEntity(bfs);