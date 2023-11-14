In order to pick up items, or to find an object in the world, through the ai we need world search algorithms

# World Search

the simplest world search algorithm is to just store everything in a list
```javascript
world.list.push("lolipop");
```
then we do a check in the list to see if the item matches a criteria
```javascript
for item in world.list
    if (item === "lolipop") return "lolipop"
```

this isn't super reasonable. say we have 10,000 lolipops, spread throughout the world

the lolipop that's 100,000 tiles away is going to match, (realistically this isn't possible), but if that chunk is loaded it absolutely is
we don't want some item far away to be chosen for item checking, and this even makes it diffifult to load the world


chunking, which we are doing does solve this issue
if we store items in each chunk, we can then check the chunk for if the item is in there

if we check the surrounding chunks, or the loaded ones for food this it becomes alot simpler to search for lolipops


chunk specific item searching would also make the process of saving to a file easier, since changing one chunk means we save the edits only on that chunk

worldGrid.getChunk(x,y) //{tiles: [], items: []} //we don't nessesarily hold the tile directly in the chunk, but we will when we save and load a chunk