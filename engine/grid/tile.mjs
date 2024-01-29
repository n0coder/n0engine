export class Tile {
	constructor(x,y) {
		this.x = x, this.y = y;		
	}
	build(chain) {
		if (Array.isArray(chain)) {
			for (const tool of chain) {
				tool.build?.(this)
			}
		} else {
			chain.build?.(this)
		}
	}
}
let tile = new Tile(4, 5)

let sum = function (a) {
	return {
		build(tile) {
			tile.sx = tile.x + a, 
			tile.sy = tile.y + a
		}
	}
}
tile.build([sum(3)])
console.log(tile)