going to add shared n0engine features to the repo

# world grid tech
   - set basic tile size, set basic chunk size, and scale
   - convert between screen space, tile space, and chunk space
   - find the bounding box in each space given

# path finding tech
   - a* pathfinding, which uses the world grid to map out tiles in a bounding box... 

# procedural generation techs
   - use noise to control noise, 
   - make biome maps, which take in multiple factors (sugar, humidity, temperature, elevation, population) etc   

### factor controlled factors
   what i mean is that i want to be able to control the values of properties based on coordinates, based on noise
   I've literally done it before, i have to rewrite the tech but it shouldn't be too hard to remake
   what that also means i that i can control noise values based on noise values

# backtracking tech? (i don't get how to do this properly still...)


https://www.npmjs.com/package/simplex-noise 
//i use this noise algorithm since it supports alea
//i still have to figure out specifically what's going on; i don't trust noise algorithms to remain deterministic (yet).

https://github.com/prettymuchbryce/easystarjs
i think i used easy star in my original implementation of the pathfinding

