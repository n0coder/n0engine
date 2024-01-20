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

this is a variant of BFS which searches from a center point out in a radius
```javascript
function radiBFS(cx, cy, radius, property) {
    let queue = [[cx,cy]], visited = new Set(), results=[];
    let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    while (queue.length > 0) {
        let [x, y] = queue.shift();
        let tile = worldGrid.getTile(x, y);
        if (tile && tile[property] != null) 
            results.push(tile)

        visited.add(`${x}, ${y}`);
        for (let d of directions) {
            var dx = x + d[0];
            var dy = y + d[1];
            var notVisited = !visited.has(`${dx}, ${dy}`)
            var inRange = distance(dx, dy, cx, cy) <= radius;
            if (notVisited && inRange) 
                queue.push([dx, dy]);            
        }
    }
}
```
this code is a style for drawing circles around a circle
```javascript
//this is a script which draws e
let radius = 20, sradius = 5, spacing = .75;
let numCircles = (3*radius)/(sradius*spacing);
p.text(`${numCircles}`, this.x+10, this.y-36);
        
for (let i = 0; i < 2 * p.PI; i += 2 * p.PI / numCircles) {
  let x = radius * Math.cos(i);
  let y = radius * Math.sin(i);
  p.ellipse(this.x+x, this.y+y, 2* sradius);
}
```

i don't like that style
so i wrote a bfs circle edge system

### circlecast bfs

instead of starting at a single point in BFS
we will gather all points on the edge of a radius 
```javascript

```

generator functions (in javascript) are useful for creating iterators, for iterating over a set of data
but they're also useful for generating things, in an iterator like way. 

a cool concept would be to use iterators as a search space. what i mean by this, is creating a constant space to search over.

the inital envionment would hold the basic info datatypes, such as the tiles we already visited.
this would allow the generator to perform multiple search algorithms and allow the nano to be controlled along the way.
so we can run a limited BFS algorithm, limited by distance, or by a certain arc for example. if we needed to search a bigger space, we have the character move to another location, to perform the radial/arc bfs algorithm again using that same set of visited points
this way the search space is more efficient; and allows for the character to have time to walk to the next search spot?