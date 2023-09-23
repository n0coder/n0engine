import { cosmicEntityManager } from "./CosmicEntity/CosmicEntityManager.mjs";
export const globalEntities = []; //? i don't understand this

export function startGlobalEntities() {
    for (const entity of globalEntities) {
        cosmicEntityManager.addEntity(entity);
        if (entity.start) entity.start();
    }
}