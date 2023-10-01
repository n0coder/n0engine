import { camera } from "./Camera/camera.mjs";
import { cosmicEntityManager } from "./CosmicEntity/CosmicEntityManager.mjs";

//this is a script that makes sure a select few entities are loaded long before any others.

export const globalEntities = []; 

globalEntities.push(camera)

export function startGlobalEntities() {
    for (const entity of globalEntities) {
        cosmicEntityManager.addEntity(entity);
        if (entity.start) entity.start();
    }
}