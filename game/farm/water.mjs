import { setActive } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { worldGrid } from "../../engine/grid/worldGrid.mjs";

export const waterActions = new Map()
export class Water {
    constructor(x, y, level = 99999) {
        this.x = x;
        this.y = y;
        this.waterLevel = level

        var rect = worldGrid.gridBoundsScreenSpace(x, y);
        this.rect = rect
        this.cx = rect.x + (rect.w / 2);
        this.cy = rect.y + (rect.h / 2);

        this.setActive = setActive
        this.setActive(true)
    }
    draw() {
        var { x, y, w, h } = this.rect;
        p.push()
        p.fill(100, 100, 200)
        p.rect(x, y, w, h)
        p.pop()
    }
    use(nanoai) {
        return useItems(nanoai, this, "water");
    }
}
