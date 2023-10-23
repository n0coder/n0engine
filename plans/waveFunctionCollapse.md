# wave function collapse

an algorithm that forms a world using rules defined in a tileset

## how it works
a tile has a rule for which neighbors can be next to it

1. the number 0 can be next to number 1
2. the number 1 can be next to number 2 or 0
3. the number 2 can be next to number 1.

we pick what tile can go next by picking tiles with least entropy
> entropy is most commonly the count of what a tile can be 
1. [0,1,2] //this is entropy of 3
2. [0,1] //this is entropy of 2

now we can figure out a set of ideas

[[0,1,2],[0,1,2],[0,1,2],[0,1,2]]

we choose a random tile of all the tiles matching lowest entropy

[ **1** ,[0,1,2],[0,1,2],[0,1,2]]

i *"randomly"* chose the first tile to be a **1**

now we have to analyze the tile adjacent to the **1**

[ **1**, [0,1,2], ... ] since the rule for 1 is that it can neighbor 0 or 2, we reduce the entropy 

[**1**, [0,2], ...]
then we can pick a new random number, **2**

[**1**, **2**, [0,1,2], ...]

we repeat this until we find the result of all possible tiles.

> you can weight the possibilities, to change their chances of spawning 
---

# wave function collapse,

this is a style of procedural generation where we evaluate what tiles go next to eachother using a set of rules.

the most common implementations of this algorithm are basic. that [0,1,2] chooser we made shows the simplicity of WFC. as you may have guessed it can only move between 0, 1, and 2. 

0,1,2,1,0,1,0,1,0,1,2,1,2,1  this is the extent of the work we did.
it can only be this kind of order. 0 to 1, 1 to 0 or 2, and 2 to 1.

the algorithm is so basic it's an easy way for some people to generate random dungons, to make large villages, or extend the same looking landscape over an infinite distance.

this sucks, because the current implementation of wave function collapse can't handle any form of real complexity.


not only all of this, but the algorithm is random, by nature.
look under the skin of the tiles it outputs and you still effectively recieve the underlying noise map you used to get to the result you got.

---

> wave function collapse allows for random smoothing, in the same kind of way a noise map would give you, but with an added layer of controllability.


##### *with an added layer of complexity to set up the values you recieve*, *with the added layer of not being able to control the placement of tiles*, *with the added layer of not having control over what a tile is*, *with an added layer of consistant inconsistancies*
---

ok, so why do i seem so pessemistic over the wave function collapse algorithm? in the current form it is extremely limited.

## I propose a few control layers

### entropy -- (how to control entropy)
instead of starting out with all possible tiles [0,1,2],



we can add them based on their context

start from nothing, add possible tiles based on a predefined world
1. check biome of the current tile, add them to a list 
2. check the factors of the world, we can eliminate tiles which don't fit in a specific climate. 

hot flowers can only spawn in humid temperatures, in a desert, so if the tile is humid enough we add the tile to the list of entropy. we add them in beyond a specific threshold, and we weight them further past it

> what this means is if we predefine a tile being 0 bound, the only options are to be 0 or 1. etc. (we can skip tiles that we can't reach to begin with)
### weights

we can calculate spawn weights for specific tiles based on world factors.
such as sugary tiles weights increase as the world has more and more sugar.
this means there is a higher chance that sugary plants spawn in places with more sugar.

---
the world is made up of random numbers given from noise maps (like 1.18 minecraft)
we can use that data to drive wave function collapse.


the benefit of this style is that we can use wave function collapse rules on noise maps.

cotton candy spawns in normal locations and get denser as the sugar factor increases. 

1. in bitter land, no cotton candy forms, 
2. in regular biomes cotton candy can form. 
3. in sugar lands dense cotton candy forms

### chunking, or predefining some tiles

this idea of making sure we can continue from a point that was already defined


say we start the 0,1,2 model like this: [[0,1,2],[0,1,2],2,1,2,[0,1,2],[0,1,2]]
we should be able to continue given the current state of the board. so init should handle setting neighbors of predefined tiles

```js
init(board) {
    if (board) {
        var flata = board.flat(3);
        for(var f of flata) {
            if (typeof f.choices === 'Number') {
                //calculate entropy of the tile
            }
        }
    } else {
        //make a board
    }
}
```

... this init function assumes we're working on a fixed grid... so we'd have to use a different grid model. an open grid model
which we basically are doing...  (WAIT A MOMENT, that's why we can flat the board and have it still work... the board is fake)...

so, effectively we should populate a grid -| hold it, i was assuming we needed the fixed grid to begin with.


```javascript 
//given we can use an open map style
var board = new Map();
var currentTile = board.get(`${x}, ${y}`)
//we could get neighbors like this
//then we can tell the tiles to reduce their entropy based on the condition of the current tile...
//maybe we can set the current tile to reduce it's entropy based on the condition of it's neighbors.
//that would probably fit the chunking wfc style better

let up = board.get(`${x}, ${y-1}`)
let right = board.get(`${x+1}, ${y}`);
let down =  board.get(`${x}, ${y+1}`)
let left = board.get(`${x-1}, ${y}`);
currentTile.ns = [
    ["up", up], ["right", right],
    ["down", down], ["left",left]
]
```

the thought process goes like this:

1. we land on an unloaded tile, to the right is a loaded tile
2. we load the biome factors from the noise map set to decide on a biome
3. we collect tiles which relate to the current tile and it's neighbors
    
> imagine we have a beach on the right, and a grassland on the left, we need tiles which can blend between the beach and the grassland

4. figure out which direction the tile comes from and load in tiles which have that specified orientation

> load in all tiles which have the beach on the right and the grassland on the left.

---

already with this information you can see why this could be helpful
we're not considering a desert tile bordering a forest in this exchange.

that's the kind of consideration the normal wave function collapse algorithm would take into account.

### weights and biases

it is important to consider that some plants are rarer than others even given the same conditions. 
we can have a global low weight for rare plants. it compounds with the computed weights given from the factors system


---

the goal is to increase control over the wave function collapse algorithm. turning it into a true wave function collapse implementation.
(since entropy is defined based on it's environment and all)

### backtracking

this is the idea of handling grid slots we forgot to consider

> the nanoai taught me the true meaning of backtracking while we were implementing nano function collapse

> nfc is the (0,1,2) model driven by a nanoai

when considering what tile to choose, 
we can save the alternative options in a consider later array
when we run out of possible tiles to generate we jump to a consider later array and continue working
if we visit the tile for our continue later 
we can remove it from the continue later to avoid backtracking to a tile we already considered

the idea is like this:

we walk from 0 to 3 and jump to 6
we would realistically put 4 into a continue later
but if we walk from 6 to 4 we visited the continue later spot

so it'll fire a collapse twice on that tile (which broke it in the NFC)
once naturally, then it runs out of tiles to visit so it jumps to 4 tries to collapse it before jumping to 7

> i had to understand this to figure out a way to improve my ai. 

since the nano doesn't literally store the wave function collapse tiles in it's memory, and instead as actions in it's queue

we needed a way to check if the action was already complete before attempting to start it again.

so the nano would think like this

0 -> 1 -> 2 -> 3 -| (later 4) -> 
now 6, (later 7) -> now 5 -> now 4 -| 
(later 4 complete? yes), (later 7 complete? no) -> later 7, now 8... etc 

(the ai prioritizes nows over laters)
