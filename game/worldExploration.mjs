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
/*
n0.brain.do("follow", water)
n0.brain.do("walk", 15,11);
n0.brain.do("follow", water)
*/



nanoaiActions.set("search", function(...args) {
	return {
		args, work: function (nano) {
			p.ellipse(nano.visualX, nano.visualY, 16);
			
			return true;		   
		}
	}
})

console.log(((2*3.1415926)/360)*90)
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
		let queue = [[cx,cy]], visited = new Set(), results=[];
		let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
		let angle120 = (((2*3.1415926)/360)*120);
		while (queue.length > 0) {
			
			let [x, y] = queue.shift();
			
			if (visited.has(`${x}, ${y}`)) {
				console.log(queue.slice())
				continue; //we already visited this
			}
			else if (!this.cache.get(`${x}, ${y}`))
				this.cache.set(`${x}, ${y}`, {x,y, color: [69, 69, 150, 177]});
	 
			let tile = worldGrid.getTile(x, y);
			if (tile && tile[property] != null) {
				// Add result and highlight it
				results.push({tile, x,y});
				this.cache.set(`${x}, ${y}`, {x,y, picked: true, color: [69, 255, 69, 100]});
			}
	 
			visited.add(`${x}, ${y}`);
	 
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
		normalize(x,y) {
		var mag = Math.sqrt(x*x+y*y);
		return [x/mag, y/mag, mag];
	  }
	  
	  dotProduct(vec1, vec2) {
		return vec1[0]*vec2[0] + vec1[1]*vec2[1];
	  }
	 distance(x1, y1, x2, y2) {
		let dx = x2 - x1;
		let dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	 }
}

//console.log(([[2,5], [2,2]]).find(a => [2,6]));
//let bfs = new BFSVisualizer(n0);
//cosmicEntityManager.addEntity(bfs);