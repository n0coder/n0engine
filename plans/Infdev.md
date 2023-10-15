# infdev
we need to talk about structure placement techs


minecraft, places it's decorations, based on the world that was placed below it. 
this includes trees, ores, and structures like villages etc
in this stage, the generation picks a handful of spots to place things


while we can only render a handful of chunks around the player, we need to generate a few more than that for structure generation.
we need to be able to place the player on the ground, we could force the word gen to be land at the point of spawning (0,0) like in factorio
but we could also just search for a spot around a spawn location for land

when we spawn in, we'll be in control of one nanoai, this is how the game starts.

if 0,0 is water, we'll do a check in some offset from there to find land
then we set that as our world spawn zone.

we need to come up with decoration systems, to figure out what to spawn and where.

while i did come up with some techs for tree growth, i'm not sure i want to make procedural systems for growth.
the tiles we make for our worldgen take so much from our renderer
i did hear about a concept called greedy voxels, or something but i'm not sure it's possible

if we were to optimize, i would probably go around cleaning up object and array spawns, to nest our objects and everything... it's a pickle.