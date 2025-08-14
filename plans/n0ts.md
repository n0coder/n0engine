# n0 tile system - 2025

in 2022-2023 i deep dived into the wave function collapse algorithm. over 6 months i distilled what i found were common limitations across the board when it comes to wave function collapse implementations.

---

## wave function collapse is commonly implementated as follows

1. a set fixed tileset of tiles categorized by side identifiers used to validate whether a tile is allowed to neighbor other tiles on a fixed grid.

2. usually all tiles are imported into every slot in a grid. then the grid cell with the lowest entropy (or tile count) is selected,

3. a random tile is chosen from that cell's list, set that as the selected tile then remove all tiles from each neighbor that does not fit with the selection.

4. if any tiles fail to be placed, it's common to backtrack, or restart the entire collapse.

over 2022 and 2023, i'd come to hate the algorithm. it's absurdly annoying to work with. i spent months of prototyping and writing in notebooks until i eventuially figured it out.

---

## how i improved the algorithm

i hated the fixed grid requirement, i wanted to run the algorithm over an infinite open world grid. this meant i could not backtrack, nor restart.

i've seen many people talk about how large grid sizes and or tilesets become incredibly slow as they grow. i have 23 biomes in my game, so importing every tile for the world would make it increidbly slow, theoretically.

so instead of a fixed grid, fixed tileset, i would in theory:
import tiles from the tile's biome, on each neighbor, if they exist and are collapsed, we remove tiles incompatible with the neighbor's tile from this tile's list. then we use the cell's noise generations to influence it's probability, and prune them if the probability dips below a minimum or above a maximum. if we still have all of our tiles, we collapse with a weighted random.

### inteligent backtracking alternative

if we failed to place a tile anywhere along the process, a placeholder tile would spawn in the following conditions:

1. when we start with no tiles
2. when it clashes with neighbors (current tileset, or conflicts between multiple tileset)
3. when tiles are fully filtered out

the placeholder tile knows why it was placed, so we can gather the relavent missing tile connections

the placeholder will also try to recollapse when all neighbors of the placeholder collapses. this process is semi recursive, a placeholder collapse, can cause a chain of collapses given multiple tiles fail next to eachother.