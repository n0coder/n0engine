import { Tile } from "./Tile.mjs"
import { n0jointtiles, n0tiles } from "./n0FunctionCollapse.mjs"

n0tiles.set('purple0', new Tile('assets/wave/purple/0.png', [[0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]]))
n0tiles.set('purple1', new Tile('assets/wave/purple/1.png', [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0]]))
n0tiles.set('purple2', new Tile('assets/wave/purple/2.png', [[0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 1, 0]]))
n0tiles.set('purple3', new Tile('assets/wave/purple/3.png', [[0, 0, 0], [0, 0, 0], [0, 1, 0], [0, 1, 0]]))
n0tiles.set('purple4', new Tile('assets/wave/purple/4.png', [[0, 1, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0]]))
n0tiles.set('purple5', new Tile('assets/wave/purple/5.png', [[0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 0, 0]]))
n0tiles.set('purple6', new Tile('assets/wave/purple/6.png', [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], 2))
n0tiles.set('green0', new Tile('assets/wave/green/0.png', [[2, 2, 2], [2, 3, 2], [2, 2, 2], [2, 3, 2]]))
n0tiles.set('green1', new Tile('assets/wave/green/1.png', [[2, 3, 2], [2, 2, 2], [2, 3, 2], [2, 2, 2]]))
n0tiles.set('green2', new Tile('assets/wave/green/2.png', [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]]))
n0tiles.set('green3', new Tile('assets/wave/green/3.png', [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]]))
n0tiles.set('green4', new Tile('assets/wave/green/4.png', [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]]))
n0tiles.set('green5', new Tile('assets/wave/green/5.png', [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]]))
n0tiles.set('green6', new Tile('assets/wave/green/6.png', [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]],1))

n0jointtiles.set('green+purple', ['greenpurple0','greenpurple1','greenpurple2','greenpurple3',
'greenpurple4','greenpurple5','greenpurple6','greenpurple7','greenpurple8','greenpurple9',
'greenpurple10','greenpurple11'])
n0tiles.set('greenpurple0', new Tile('assets/wave/greenpurple/0.png', [[2, 4, 0], [2, 4, 0], [0,0,0], [0,0,0]],.25))
n0tiles.set('greenpurple1', new Tile('assets/wave/greenpurple/1.png', [[2, 4, 0], [0,0,0], [0,0,0], [2,4,0]],.25))
n0tiles.set('greenpurple2', new Tile('assets/wave/greenpurple/2.png', [[0,0,0], [0,0,0], [2,4,0], [2, 4, 0]],.25))
n0tiles.set('greenpurple3', new Tile('assets/wave/greenpurple/3.png', [[0,0,0], [2, 4, 0], [0, 4, 2], [0,0,0]],.25))
n0tiles.set('greenpurple4', new Tile('assets/wave/greenpurple/4.png', [[0, 4, 2], [2,2,2], [0, 4, 2], [0,0,0]],.25))
n0tiles.set('greenpurple5', new Tile('assets/wave/greenpurple/5.png', [[2, 2, 2], [2, 4,0], [0,0,0], [2, 4, 0]],.25))
n0tiles.set('greenpurple6', new Tile('assets/wave/greenpurple/6.png', [[2, 4, 0], [0,0,0], [2, 4, 0], [2,2,2]],.25))
n0tiles.set('greenpurple7', new Tile('assets/wave/greenpurple/7.png', [[0,0,0], [0, 4, 2], [2, 2, 2], [0, 4, 2]],.25))
n0tiles.set('greenpurple8', new Tile('assets/wave/greenpurple/8.png', [[2, 4, 0], [0,1,0], [2, 4, 0], [2, 3, 2]],.25))
n0tiles.set('greenpurple9', new Tile('assets/wave/greenpurple/9.png', [[0,1,0], [0, 4, 2], [2, 3, 2], [0, 4, 2]],.25))
n0tiles.set('greenpurple10', new Tile('assets/wave/greenpurple/10.png', [[0, 4, 2], [2, 3, 2], [0, 4, 2], [0, 1, 0]],.25))
n0tiles.set('greenpurple11', new Tile('assets/wave/greenpurple/11.png', [[2, 3, 2], [2, 4,0], [0,1,0], [2,4,0]],.25))
