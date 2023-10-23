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

