import { p } from "../../../../engine/core/p5engine.ts";
import { ticks } from "../../../../engine/core/Time/n0Time.mjs";
import { worldGrid } from "../../../../engine/grid/worldGrid.ts";
import { clamp, inverseLerp, lerp } from "../../../../engine/n0math/ranges.mjs";
import { biomeMap } from "../../BiomeWork.mjs";
import { read, worldFactors } from "../../FactorManager.mjs";
import { n0tiles } from "../n0.mjs";
import { genTile } from "./TileBuilder.ts";

let c = worldGrid.chunkSize, chunks = 8
export function drawChunks(nano, gen) {
    for (let xc = -(chunks + 4); xc <= chunks+5; xc++) {
        for (let yc = -(chunks+2); yc <= chunks+2; yc++) {
            let nx = (xc * c) + nano.x, ny = (yc * c) + nano.y
            
            let mag = ((nano.x-nx)**2)+((nano.y - ny)**2)
            mag = Math.sqrt(mag)*2;

            let dis =  mag < (nano.sightRadius ?? worldGrid.tileSize*2.5)  
            if (dis) {
                //let { x, y } = worldGrid.screenToChunkPoint(nx * worldGrid.tileSize, ny * worldGrid.tileSize)
                let x = Math.round(nx/worldGrid.chunkSize);
                let y = Math.round(ny/worldGrid.chunkSize);
                drawChunk(x*c, y*c, gen)
            }
        }
    }
}

export function drawTile(x,y, tile) {    
    let tileSize = worldGrid.tileSize;
    let color = biomeMap.get(tile.biome).colora(tile)
    let inv2 = 1;
    if (tile.z !== undefined) inv2 = tile.invZ;
    if(color) {
    if (!p.webgl) {
        
        p.fill(color[0]*inv2, color[1]*inv2, color[2]*inv2);

        if (false && tile.transition ) {
            let i = inverseLerp(0, .05, clamp(0,.05, tile.transition.proximity))
            i = lerp(.5, 1, i);
            let pseudocolor =  tile?.transition?.pseudotile?.biome?.colora(tile.transition.pseudotile)
            
            if ( pseudocolor && tile.transition.proximity <= .1) {
                let r = lerp(pseudocolor[0], color[0], i)
                let g = lerp(pseudocolor[1], color[1], i)
                let b = lerp(pseudocolor[2], color[2], i)
                p.fill(r, g, b)
            }
        }
        if (tile.edge) {
            let r = color[0], g =color[1], b=color[2];
            let ran = false;
            for (const factor of tile.biomeFactors) {
                let i = inverseLerp(0, .1, clamp(0,.1, factor.proximity))
                let invi = lerp(.5, 1, i);
                let pseu =  biomeMap.get(factor.pseudotile.biome)
                if (!pseu) continue;
                let pseudocolor = pseu.colora(factor.pseudotile)
                if (pseudocolor && factor.proximity < .05 ) {
                    r = lerp( pseudocolor[0], r,  invi)
                    g = lerp( pseudocolor[1], g, invi)
                    b = lerp( pseudocolor[2], b,  invi)
                    ran = true;
                }  
            }
            if (ran) p.fill(r*inv2, g*inv2, b*inv2)
        }

        //tile.preview = "elevation"
        if ( read !== undefined) {
            let preview = tile.genCache.get(read);
            let wf = worldFactors.get(read)
            let invpreview = inverseLerp(wf.min, wf.max, preview);
            p.fill(invpreview*255)
        }
        
        if (false) {
            let i = inverseLerp(0, .10, clamp(0,.10, tile.transition.proximity))
            i = lerp(0, 1, i);
            p.fill(255*i);
        }
        //let invs = Math.sin(ticks*.2);
        let yz = 0 // Math.pow(inverseLerp(-1, 1, invs ), .2)*tile.z;
        p.rect(x * worldGrid.tileSize, y * worldGrid.tileSize, worldGrid.tileSize, worldGrid.tileSize)
    
    let n0ts = tile.n0ts?.option !== undefined ? tile.n0ts.tile : undefined;
    let vx = 0
    let img = n0ts?.img;
    img ??= tile.n0ts?.placeholder?.[tile.n0ts.placeholder.image];
    img ??= tile.n0tsEditorTile?.img; 




    if (img) {
        p.image(img, (x * worldGrid.tileSize)+vx, (y * worldGrid.tileSize)+vx, worldGrid.tileSize-(vx*2), worldGrid.tileSize-(vx*2));
        return
    }
    }
} else {

    let r = color[0], g = color[1], b = color[2];
    //let ran = false;

    // Factor-based neighbor blending
    for (const factor of tile.biomeFactors) {
        let i = inverseLerp(0, 0.2, clamp(0, 0.2, factor.proximity));
        let invi = lerp(0.5, 1, i);
        let pseudocolor =  biomeMap?.get(factor.pseudotile.biome)?.colora(factor.pseudotile);

        if (pseudocolor && factor.proximity < 0.2) {
            r = lerp(pseudocolor[0], r, invi);
            g = lerp(pseudocolor[1], g, invi);
            b = lerp(pseudocolor[2], b, invi);
            //ran = true;
        }
    }

    // Apply blended fill
    p.fill(r*tile.invZ, g*tile.invZ, b*tile.invZ);

    // Optional: preview mode override
    if (read !== undefined) {
        let preview = tile.genCache.get(read);
        let wf = worldFactors.get(read);
        let invpreview = inverseLerp(wf.min, wf.max, preview);
        p.fill(invpreview * 255);
    }

    // --- RENDERING BRANCH ---
    if (true) {
        
        // WEBGL mode → draw cube
        p.push();
        
        
        // Translate to tile position in 3D space
        p.translate(
            (x * tileSize) - p.width / 2 + tileSize / 2,
            (y * tileSize) - p.height / 2 + tileSize / 2,
            Math.floor(tile.z)*tileSize
        );

        p.noStroke();

        // Optional: height from a factor (e.g., elevation)
        
        p.box(32, 32, 32);
        p.pop();

    } else {
        // 2D mode → draw flat rect
        p.rect(
            x * worldGrid.tileSize,
            y * worldGrid.tileSize,
            worldGrid.tileSize,
            worldGrid.tileSize
        );
    }

    // --- IMAGE OVERLAY ---
    let n0ts = tile.n0ts?.option !== undefined ? tile.n0ts.tile : undefined;
    let vx = 0;
    let img = n0ts?.img;
    img ??= tile.n0ts?.placeholder?.[tile.n0ts.placeholder.image];
    img ??= tile.n0tsEditorTile?.img;

    if (img) {
        p.image(
            img,
            (x * worldGrid.tileSize) + vx,
            (y * worldGrid.tileSize) + vx,
            worldGrid.tileSize - (vx * 2),
            worldGrid.tileSize - (vx * 2)
        );
    }
}
}
export function drawChunk(x, y, gen) {

    for (let xc = 0; xc < c; xc++) {
        for (let yc = 0; yc < c; yc++) {
            let xx = xc+x, yy = yc+y
            genTile(xx, yy, gen)
            let tile = worldGrid.getTile(xx, yy);
            if (tile?.biome) {
                drawTile(xx,yy, tile);
            }
        }
    }
}