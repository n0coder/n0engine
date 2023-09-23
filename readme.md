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

### auto approximating the limits of the world, using ratio techs ...
   I'm stating, that being able to input 3 object into a range list; 
   i should be able to get back out the ranges... automatically based on both count, weight and range
   list (0,5) -> [water, beach, land] -> [(0, 1.667), (1.667, 3.333), (3.333, 5)] 
   the biomes can be weighted [[water, 3], beach, [land, 5]] -> [(0, 1.667), (1.667, 2.222), (2.222,5) ]
   the tech should allow for sampling based on input, so 2.55 brings up land, 1.2 is water, and 1.7 is beach... you get the idea
   pretty easy tech to make in my opinion. (i've literally done it before)

# backtracking tech? (i don't get how to do this properly still...)