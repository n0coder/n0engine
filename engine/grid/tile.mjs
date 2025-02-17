export class Tile {
	constructor(x,y) {
		this.x = x, this.y = y;
		this.layers = []
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
        } else if (tool?.build) {
            tool?.build?.(this)
        }
    }
}
