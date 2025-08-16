# lets come up with a two side inspector system for a multiple tileset editor for WFC

on the left we will render each group

```javascript
let tilesets = new Map()
tilesets.set("purple", { name: "purple", weight: .5, thresholds: [], biases: [], tiles: [
   { index:2, file: "2.png", img: { }, sides: [[0,1,0],[0,0,0],[0,0,0],[0,1,0]], thresholds: [], biases: [] }
] })
```

//you may notice each tile supports it's own thresholds and biases list, this is additive tech

```javascript
function buildTiles(definition) {
    definition.overlayDef = function (def2) {
        let tiledef = atomicClone(definition);
        for (const key in def2) {
            if (typeof def2[key] === "function")
                def2[key](tiledef, key)
            else
                tiledef[key] = def2[key]; 
        }
        return tiledef;
    }
    return definition;
}
```

this allows me to combine multiple definitions together, by setting or overwriting.

each tile is created using an image, so it's supplied later on
this is the structure of the tilesets map.

on the left we use the map as groups

```javascript
for (let tileset of tilesets) {
    for (let tile of tileset.tiles) {
        //we display the image on the left container here, clickable to add to editor to edit
    }
}
```

on the right we edit individual tiles

we have a window that shows a floating grid of each tileset, they are unlinked until we create a joint tileset, which is a seperate map object.

i don't want you to write the code. i want your input on my ideas.
