# procedural terrain systems
a long time ago in a lost document. i outlined a magical way to build procedural landscapes. a way to control noise using noise, to control amplitude, frequency, lacunarity, octaves. to be able to add noise maps together, to multiply them, to blend them. even control their offsets.

my guess for how i managed to include a blending feature, was that i could keep track of their mathematical mins and maxes, and shift those along with the numbers and noise maps controlling them. a noise that goes from -1 to 1, added to another noise -1 to 1 turns into -2 to 2. i could use that knowledge to inverse lerp the output and then lerp to whatever values i want instead. magical 

## ideas
* add contraints (add a noise to the noise)
* multiply
* blend/lerp values based on noise... (fucking how did i do it before the fuck?!)
* offset (change position)
* amp, lacunarity, persistance modifiers


all of these should be able to have regular values, added values or noise values to control them...
we're controlling noise using noise.

my guess is that i blended the noise based on expected mins and maxes... how i c... oh it’s just using the knowledge of possible ranges
when i shift the noise from -1 to 1, we can shift the outside goal posts along with the whatever we bundle

like if we add a noise that goes from -1 to 1, the max ranges jump to -2 to 2
add 0 to 1 the ranges go to -1 to 3... etc...
so by keeping track of the mins and maxes, and doing the same math on them we can figure out what values to expect. so that’s how we can provide a blending tech.

we need a way to handle blending between more than one value. phind can help generate the code that blends numbers bezier style. 