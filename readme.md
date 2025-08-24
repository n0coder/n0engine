# a small game engine designed to make open world sandbox games

![nano](./nanoai.png) **n0farm**: a game about nanoai girls farming in a big open world.

---

## ![nano](./nanoai.png) soft development style ![nano](./nanoai.png)

n0engine is designed to support an ideal that everything chooses its own existance. from the **world generator**, to something as small as a **seed object**. 

---
> [!TIP]
> any instance of any class can recieve the engine's callbacks from **p5.js**.
> you read that right, every class can directly interface with the renderer.

---

## ![nano](./nanoai.png) nanoai ![nano](./nanoai.png)

> ### nano brain

<details>

<summary>the nano brain allows for queuing, stacking, inserrung before and after other actions.</summary>

</br>

actions are queued:

```js
nano.brain.do("follow", item)
```

stacked and takes over current state:

```js
nano.brain.doNow("harvest", crop)
```

sequenced:

```js
let walk = nano.brain.do("walk", 1,2)

nano.brain.doBefore(walk, "dance")
nano.brain.doAfter(walk, "dance")
```

use any object with a work function as an action:

```js
nano.brain.do({work(nano){}})
```

</details>

---

> ### actions

<details>

<summary>here's how to define actions, direct and named</summary>

</br>

actions are any object with a work function.

```js
let action = {
   work(nano){
      //control a nano or some other object
   }
}
```

named actions are defined in the nanoaiActions map

```js
nanoaiActions.set("action", function (...args) {
   return { work(nano){ } }
})
```

the nano's brain will handle actions we need to run before others:

```js
nanoaiActions.set("action", function (...args) {
   return { 
      before: ["follow"]
      work(nano){ }
   }
})
```

> this action will automatically sequence follow before the action. the equivalent to:

```js
nano.brain.do("follow", item);
nano.brain.do("action", item)
```

> but combined so you dont need to include follow actions

</details>

---

> ### radio

<details>
<summary> handles the tech for socially sharing resources, like chests, crafting tables, jobs, waypoints </summary>

</br>

friend system (unfinished):

```js
n0radio.addFriend(nano, friend);
```

---

post items :

```js
n0radio.postItem(channel, item, key)

n0radio.postJob(channel, job)
n0radio.removeJob(channel, job, key)
```

> posting anything to the radio will automatically create the specified channel if not found.
*the key is optional.*

item search:

```js
n0radio.findItem(item, type, key)
```

greedy item search: (removes item from radio when found)

```js
n0radio.findClaimItem(item, type, key) 
```

find job:

```js
n0radio.findJob(nano)
```

> findJob differs from the other find functions.

* if no job is found, the nano is listed to be notified at a later time
* when a nano is hired, its work is queued, so it can finish its current set of actions before starting.

</details>

---

> ### job system

if you thought the nano's tech wasn't powerful enough,
<details>
<summary>the job system handles <b>more complex dependancy chains with resource management.</b> it even supports <b>multiple nanos working together.</b> the nanos also rate jobs based on <b>skill, opinions, relationship and proximity to the job site</b></summary>

</br>

create job:

```js
let job = createJobu([crop], "harvest")
```

work on it directly or post it to the radio (*with or without the key*):

```js
nano.brain.do(job);
n0radio.postJob(channel, job, key)
```

the way we create jobs is similar to how we create actions:

```js
jobTasks.set("jobTask", function( jobWork, ...extraArgs){ return {
   work(job, nano) {

   }
}})
```

tasks differ from actions in how they are processed.
much like how actions have a before, tasks have a requires that implements resource sharing through instancing.

interactions influence the skill system, and job scoring through opinions about types of skills of work and items.

```js
{
   interactions: [["walking"], [skill, type, thing]]
   requires: ["task", sharedObject, ...args]
   work(job, nano){ }
}
```

</details>

---

> ### ping *job* system

a game about fully autonomous ai girls would not function if not for systems to create work for nanos.

<details>
<summary>the first system to tie nanos to the world is the ping system. objects ping radio when ready and jobs are created based on a recipe</summary>

</br>

send either vague/fuzzy concepts or specific pings:

```js
pinga.ping("take", chest, item)
pinga.ping("insert", chest, "crop")
```

> the possibility of a system not knowing what its pinging is something i program for

the ping system takes multiple kinds of pings, then cross references them with a recipe map system.

this system was just concepualized so it's a mess as of (april 8 2025)

```js
n0pingJobs.get("harvest").set("insert", {
   create(items, ...args) {
      //currently reccomended to map items to their job related names :o
      items = items.map(item=>{return{ crop: item.a, chest: item.b }})

      n0radio.postJob(createJob(items, "harvest-insert", ...args))
   },
   canLink(ping, ping2){
      return ping.owner === ping2.owner
   }
})
```

just like that when a harvest and insert ping is called, at the end of the frame jobs will be formed and added to the radio. 

its the most complex of all the nanoai systems, for sure. totally.

just like that we've covered the basics of nanoai systems, it only took 200 lines to describe 2200 lines worth of code by name only.

</details>

---

## ![nano](./nanoai.png) world generation ![nano](./nanoai.png)

> ### noise

<details>

<summary>using mathematical functions to create smooth believable looking terrain</summary>

</br>

the world generation starts with creating noise values,

either through the noise generator

```javascript
var temp = new NoiseGenerator({ scale: scale * 1000, octaves: 3, persistance: .25, add: [[elevation, -.3]], lacunarity: 2, blend: [-1, 1] });
worldFactors.set("temperature", temp)
```

or the math grapher

```javascript
let graph = new Graph();
graph.scale(10).fractal([inf, xnf, xnf], 1, .5, 2);
graph.amp().offsetX().offsetY(1);
graph.lowClip(-1).highClip(1).abs()
graph.invert().pow(1).add(1).multiply(1)
graph.map([
    { "c": 0.05, "y": 0, "p": 2 }, { "c": 0.5, "y": 0.9, "p": 3 }, { "c": .95, "y": 1, "p": 2 }
])
graph.amp(10)
```

with both techs, you can insert a grapher or noise generator as input for any of the mathematical functions
the graph has one advantage over the noise generator, graphs can use the same mathematical function multiple times.

at some (x, y) position we use these advanced noise functions to create each world factor value

```javascript
let temp = worldFactor.get("temperature")
let noise =worldFactor.getValue?.(tile.x, tile.y, false) //noise generator output
noise ??=worldFactor.create?.(tile.x, tile.y)?.sum      //graph output
```

the grapher and noise generator keep track of the global min and max of the specified noise value. with one catch, some mathematical formulas are inherently harder to capture the limits on.

</details>

---

> ### biome classification

<details>
<summary>a set of systems to find what biome the random numbers lands in</summary>

</br>

biomes are created using noise values
literally searching if the noise is between a min and max value

```javascript
biome = { factors: [ { factor: "temperature", min: -1, max: 1} ] }
let temp = worldFactor.get("temperature")
let noise =worldFactor.getValue?.(tile.x, tile.y, false) //noise generator output
noise ??=worldFactor.create?.(tile.x, tile.y)?.sum
let {factor, min,max } = biome.factors[0];

if ( min < noise && noise > max ) {
   /* its hot enough or something */
}
```

the actual biome definition,  uses tags formed from a map that perfectly splits the min max between items in a rangema; a weighted array that is indexed by it's weights and can output the fine bounds of each item.
 

```javascript
var squish = new RangeMap(0, 1);
squish.add("peaks", .22).add("mountainous", .405).add("hilly", .1525)
squish.add("rolling", 0.2725).add("folds", .4).add("shattered", .1).add("flat", .55)
addBiomeFactors(squish, "squish",worldFactors);
```

```javascript
var ranges = squish.exportRanges(factor, gen.minm, gen.maxm)
```

which means i'm able to define a forest like this:

```js
formBiome({
    name: "forest",
    plaintags: [surface, [["cold"], ["warm"], "moderate"], ["neutral", "moist"]],
    sweettags: [surface, [["cold",...sweeta], ["warm",...sweeta]], ["neutral", "moist",...sweeta]],
    bittertags: [surface, [["cold",...bittera], ["warm",...bittera]], ["neutral", "moist",...bittera]],
    tiles: [...grassy],
    difficulty: 2
})
```

</details>

---

> ### decoration with n0ts (**n0's tile system**)

<details>
<summary>a lightweight random decoration selection system</summary>

</br>

adding a tile

```javascript
   let tile = new Tile('assets/wave/purple/0.png')
   n0tiles.set('purple0', tile); 
```

using n0ts (manually):

```javascript
let tile = [  ]
buildn0ts(tile, ["purple0"])
```

what's perhaps more cool is this tech expands to weights, biases, thresholds, and side constraints

when we don't insert any tiles, ie ``buildn0ts(tile, ["purple0"])`` or the selected tiles are not available, the n0ts will build a placeholder tile which contains and explains the failing case.

if we imported two tiles but neither have matching side values, they will create a placeholder describing the sides involved in the clash. if multiple tilesets were involved in the clash, it shows a "multiple tileset clash" error visual.

a current semi-full tileset defintion looks like this:

```javascript
addTiles({
    name: "green",
    path: "/assets/wave/green", 
    imgRules: [
        [2, "2.png", [[2, 3, 2], [2, 2, 2], [2, 2, 2], [2, 3, 2]]],
        [3, "3.png", [[2, 2, 2], [2, 2, 2], [2, 3, 2], [2, 3, 2]]],
        [4, "4.png", [[2, 3, 2], [2, 3, 2], [2, 2, 2], [2, 2, 2]]],
        [5, "5.png", [[2, 2, 2], [2, 3, 2], [2, 3, 2], [2, 2, 2]]],
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}], 
    biases: [{factor: "temperature", value: 1}]
})
```

> note the weights, thresholds and biases

</details>

---

> ## packages

https://www.npmjs.com/package/simplex-noise 
//i use this noise algorithm since it supports alea (i became a fan of alea because of it)

https://github.com/prettymuchbryce/easystarjs
i think i used easy star in my original implementation of the pathfinding
