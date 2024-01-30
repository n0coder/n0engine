export class Tile {
	constructor(x,y) {
		this.x = x, this.y = y;		
	}
	build(chain) {
		if (Array.isArray(chain)) {
			for (const tool of chain) {
				this.toolBuild(tool)
			}
		} else {
			this.toolBuild(chain)
		}
	} 
	toolBuild(tool) {
        if (typeof tool === 'function') {
            tool?.(this)		
        } else if (typeof tool.build === 'function') {
            tool?.build?.(this)
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