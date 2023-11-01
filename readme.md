> # nanofarm
the main game i feel the drive to make is called nanofarm
a game about nanoais farming in a big open world

the open nature of the world extends to the development style
n0engine is a soft hooked engine, 

objects choose whether or not to exist
the rendering aspects, and object workflows are built into the engine

the engine is built in such a way to allow for the world to be shared between multiple genres
if i make a big farming world, and add dunctions for an rpg then 
the player will have a place to visit on the surface

going to add shared n0engine features to the repo

## currently working on:

nanoai techs. attack and defend techs. jobs, and pathfinding.
possibly emotions.


## nanoai 
   - nanoai.brain.do("walk", 2,5) //ask the nanoai to walk to position 2, 5
   - actions are queued, actions can have prerequisites
   - nanoai.brain.do("pickup", item) //walk to item and pick it up

## path finding tech
   - a* pathfinding, which uses the world grid to map out tiles in a bounding box... 
   - waypoint systems


later on continue world generator techs. (got burnt out spending two full weeks world building)

biome decoration systems, placing trees, grass, rocks, other native wild life.
structure planning, figuring out where to place structures


## genetic algorithms
   while the ai itself does not use genetic algorithms to learn the world, 
   the plants of the world, change based on what is planted
   white plant can become a different color given you grow the plants that lean in the color you want
   1. grow seeds of white plant
   2. take seeds from the plant which happens to be tinted in the color
   3. it'll grow a tinted version of the white plant
   4. repeat 

## plant based activity
   different plants will behave differently than others.
   - pop flowers pop their fruit off when fully grown
   - cloudium stays attached until it's picked off -> goes directly into inventory
   - crystals need to be broken off the surface 
   - sof flowers can be picked from the ground whole

## world grid tech
   - set basic tile size, set basic chunk size, and scale
   - convert between screen space, tile space, and chunk space
   - find the bounding box in each space given

## procedural generation techs
   - use noise to control noise, 
   - make biome maps, which take in multiple factors (sugar, humidity, temperature, elevation, population) etc   

### factor controlled factors
   what i mean is that i want to be able to control the values of properties based on coordinates, based on noise
   I've literally done it before, i have to rewrite the tech but it shouldn't be too hard to remake
   what that also means i that i can control noise values based on noise values

## backtracking tech? (i don't get how to do this properly still...)
   i should do some practice runs on getting backtracking

https://www.npmjs.com/package/simplex-noise 
//i use this noise algorithm since it supports alea (i became a fan of alea because of it)
//i still have to figure out specifically what's going on; i don't trust noise algorithms to remain deterministic (yet).

https://github.com/prettymuchbryce/easystarjs
i think i used easy star in my original implementation of the pathfinding

