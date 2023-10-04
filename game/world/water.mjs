import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

export const waterActions = new Map()
export class Water {
    constructor(x,y,level=99999) {
        this.x = x;
        this.y = y;
        this.level = level

        var [gx,gy] = worldGrid.screenToWorldPosition(x, y)
        var rect = worldGrid.getScreenTileRect(gx,gy);
        this.rect = rect
        this.cx = rect.x + (rect.w/2);
        this.cy = rect.y+ (rect.h/2);

        this.setActive = setActive
        this.setActive(true)
    }
    draw() {
        
        var {x,y,w,h} = this.rect;
        p.push()
        p.fill(100, 100, 200)
        p.rect(x,y,w,h)
        p.pop()
    }
    use (nanoai) {
        var o = new Map()
        //collect items with their actions
        for (let i = 0; i < Math.min(nanoai.inventory.list.length, nanoai.inventory.offsets.length); i++) {
            const item = nanoai.inventory.list[i];
            var v = o.get(item.constructor.name)
            if (!v) o.set(item.constructor.name, {c:1, i:[item]})
            else {v.c++; v.i.push(item)};
        }
        o.forEach( (c,cc) => {
            var action = waterActions.get(`${cc}`)
            if (action) action(nanoai, c.i, this);
        });
    }
}

