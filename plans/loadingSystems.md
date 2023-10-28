the world of gamedev has alot of things that depend on other things to function. if you try to render an image before it loads the entire game will wait for that image. if it's small you won't notice the slowdown, until you add in just a handful more.

loading systems, allow you to control what loads and when. instead of having absolutely everything load in at the same time, you could load in what's most important at start, then when you generate maps, the maps already have the stuff ready to show off...

this is a hard topic for me at the moment. Something that's abstract in an interesting way. 

I will take pieces of the game, figure out what parts are load and what parts depend on those loads. 

this idea of, loading in the character during loading screens is rather important.


on my current hardware, the game takes quite a few seconds to load in the world, it's textures and their details.

without wave function collapse, which depends on the biome map
what i mean with only the biome map, the whole grid shows up in an instant. the moment i do the wave function collapse algorithm it slows down to a crawl. I know why, 

it's a handful of optimization techniques i used to figure out world tech. but, loading screens give a way to visualize what parts of the world are taking longer than they realistically should. 

you can run a loading tech over multiple frames and call the progress out to the ui, or you can send that info back into an object manager. you could have a system where some feature waits on another to say it's finished to start doing it's work.

each step along the way can give relatively detailed descriptions of what they're doing

when loading textures for dirt tiles, you can have the loading menu state "loading in dirt tiles", when loading in template tiles (to make working with wfc even easier "setting up template tiles"). etc. 

that's when you can have it make the tiles using the templates as a formula for how the world should treat it.


among other ideas.