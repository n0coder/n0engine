a small game engine designed to make open world sandbox games

![nano](./nanoai.png) **n0farm**: a game about nanoai girls farming in a big open world.

---



### ![nano](./nanoai.png) soft development style ![nano](./nanoai.png)

n0engine is designed to support an ideal that everything chooses its own existance. from the **world generator**, to something as small as a **seed object**. 

---
> [!TIP] 
> any instance of any class can recieve the engine's callbacks from **p5.js**. 
> you read that right, every class can directly interface with the renderer. 

---


# ![nano](./nanoai.png) nanoai ![nano](./nanoai.png)

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
<summary>handles the tech for socially sharing resources, like chests, crafting tables, jobs, waypoints
</summary>

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

# ![nano](./nanoai.png) n0ts (wave function collapse) ![nano](./nanoai.png)

> ### procedural world generation

the **n0ts system** generates infinite, coherent worlds through wave function collapse with environmental factor integration.

<details>

<summary>**multi-layered generation pipeline** creates worlds that feel alive and interconnected</summary>

</br>

the system works in phases:
```js
tile.build([
    buildFactors,    // generate noise maps
    buildBiome,      // categorize noise to biomes  
    addSugar,        // overlay difficulty system
    buildn0Collapse  // place coherent tiles
])
```

**environmental factors** drive everything:
- elevation, temperature, humidity interact naturally
- rivers carve through landscapes based on elevation
- biomes emerge from factor combinations
- sugar zones add gameplay flavor to regions

**wave function collapse** ensures visual coherence:
- tiles constrain neighbors through edge matching
- placeholder system gracefully handles conflicts
- joint tiles create smooth biome transitions

</details>

---

> ### factor system

<details>
<summary>composable noise generators create realistic environmental patterns</summary>

</br>

factors are built from **noise generators** with rich composition:
```js
var elevation = new NoiseGenerator({
    scale: scale * 400, octaves: 3, persistance: .5, lacunarity: 2,
    power: squish, blend: [-1, 1],
    mapSpace: [0, 1.1], 
    map: [
        { "c": 0, "y": 0.01, "p": 3 }, 
        { "c": .3, "y": .4 }, 
        { "c": .72, "y": .85 }
    ]
});
```

factors influence each other:
```js
var humidity = new NoiseGenerator({
    add: [[riverWorksR, -.2], [elevation, .25]],
    blend: [-1,1]
});
```

**graph-based approach** for cleaner composition:
```js
let elevation = new Graph()
    .offsetXY(-8,8)
    .scaleXY(15)
    .fractal([circleNoise])
    .abs().invert()
    .lowClip(.01)
```

</details>

---

> ### biome classification

<details>
<summary>nested tag system maps environmental conditions to biomes with **bitter/neutral/sweet** variants</summary>

</br>

biomes are defined through **environmental constraints**:
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

**three-tier system** creates regional variety:
- **bitter zones**: higher difficulty, darker colors
- **neutral zones**: balanced, standard appearance  
- **sweet zones**: easier difficulty, brighter colors

biomes **emerge naturally** from factor combinations - no manual placement needed.

</details>

---

> ### tile placement

<details>
<summary>wave function collapse with **factor-based weighting** creates coherent, varied landscapes</summary>

</br>

**constraint satisfaction** through edge matching:
```js
tile.setSides([[0,1,0],[0,0,0],[0,0,0],[0,1,0]]);
// tiles can only connect to compatible neighbors
```

**environmental influence** on tile selection:
```js
tile.addThreshold({factor: "elevation", min: -1, max: 1});
tile.addBias({factor: "temperature", value: -1});
// tiles appear based on environmental conditions
```

**graceful conflict resolution**:
- placeholder tiles explain generation failures
- joint tiles handle biome transitions
- debug system shows constraint conflicts

**modular tile definition**:
```js
addTiles({
    name: "purple", path: "/assets/wave/purple",
    imgRules: [
        [2, "2.png", [[0,1,0],[0,0,0],[0,0,0],[0,1,0]]],
        [3, "3.png", [[0,0,0],[0,0,0],[0,1,0],[0,1,0]]]
    ],
    weight: .5,
    thresholds: [{factor: "elevation", min: -1, max: 1}],
    biases: [{factor: "temperature", value: -1}]
})
```

</details>

---

the **n0ts system** creates large opern worlds that feel **more naturally generated** - where every mountain, forest, and river emerges from the interaction of simple environmental rules.

---


> ## packages:

https://www.npmjs.com/package/simplex-noise 
//i use this noise algorithm since it supports alea (i became a fan of alea because of it)

https://github.com/prettymuchbryce/easystarjs
i think i used easy star in my original implementation of the pathfinding

