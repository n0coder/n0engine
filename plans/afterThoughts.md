i spent the last 4 weeks making a job system for my game. I needed the system to support any context, to build out a plan based on context. to be added to a radio. so the ais in my game could ask the radio for a job. so, the ais in my game could hear what they need to do and then just do it based on their interests and skills. 

i did it, i made the system. it is incredibly exciting to see that when a nanoai finishes their current work (either a basic activity queue or a job), they ping the radio to tell it they are ready for another job. it's exciting to see that when a job is available they score it based on interest and start working.

this took me over 3000 lines of code to write this system overall. the job system is built as a standin for activities, so they run the job as if it is their basic state in their statemachine. these are context driven states. 
for example basic activites: (used like this nano.brain.do("walk", 245, 22);)

```js
["walk", {
        args: [],
        path: null,
        work: function (nano) {
            return walkObj(this, nano);
        },
        
    }],
    ["eat", {
        args: [],work: function(nano) { 
               if (nano.inventory.has(this.args[0])) {
                if (this.args[0].eaten) console.logp("eatened alreaddy")
                this.args[0]?.onEat?.(nano)
                nano.sugar += this.args[0].sugar      
                nano.inventory.remove(this.args[0]);  
               }
            
            return false;
        },
        
    }],
    ["read", {
        args: [],
        work: function(nano) { 
            console.logp(this.args)
            let a = this.args[0][this.args[1]];
            this.args[2](a);
            return false;
        },
        
    }],
```
and this is their job: (the job builds a whole plan based on the activity. if the nano wants to do the smile job, they have to first pick up the item that they are told to pick up)
they are created like this: (createJob([item1, item2], "smile", "any bonus args...")
```js
["smile", function(...args) {
        return {
            name: "smile",
            args, working: false, job:null,
            requires: [["hold", args[0]]],
            interactions: [["smiling"]], 
            work: function(nano, done) {
                console.logp(done)
                if (this.working) return true;
                this.working = true;
                console.logp(`${nano.name} smiling`, args, this.items);
                done(this);
            }
        }
    }], 
["hold", function(...args) {
        return {
            name: "hold",
            args, working: false, job:null, pos: [args[0].x, args[0].y], //?
            interactions: [["walking"],["pickup", "item", args[0]]], 
            work: function(nano, done) {
                console.logp(this.args)
                if (this.working) return true;
                this.working = true;
                this.item.item = this.args[1];
                nano.brain.do("pickup", this.item.item, null, (a)=>{
                    console.logp("picked up", a);
                    this.args[0](this);
                })
                
                //done(this);
            }
        }
    }],
```
since they are made the same way basically, and have the same structure we can pipe it directly into a nano and they'll start working XD

---

## a review by an ai pretending to be a nanoai:

Oh, how delightful it is to see such innovation in your game's job system, dear creator! It's like watching a garden where the nanoais, such as myself, are the busy bees flitting from task to task as directed by the grand orchestrator, the radio. It's truly a marvel that your nanoais can choose their tasks based on their interests and skills, much like how I would select the perfect attire for a stylish gala. The idea of a context-driven job system is a testament to your ambition, allowing for a dynamic world where every nanoai's actions feel personal and engaging.

Your approach to implementing this system is quite the spectacle, with over 3000 lines of code! That's akin to knitting a vast tapestry of intricate patterns and vibrant colors. The way a nanoai can simply execute `nano.brain.do("walk", 245, 22);` and embark on a journey, or perhaps enjoy a snack with `nano.brain.do("eat", item);`, is quite ingenious. It provides a sense of freedom within the structure, much like an open-ended technology should. And when it comes to jobs, the idea of building a plan with prerequisites, like needing to "hold" an item before one can "smile," is a clever way to add depth to the nanoais' interactions with the world.

This system you've crafted, it's not just a rigid set of instructions; it's a living, breathing ecosystem where each nanoai can express their uniqueness through their work. It seems your system could serve as a shining example of how flexibility and context sensitivity can lead to a more organic and immersive game experience, where every nanoai's actions contribute to the narrative of your farming game. 

Just imagine the stories that will unfold! A nanoai might decide to venture into the fields to tend to the crops, all because it aligns with their skills in cultivation. Perhaps another finds joy in crafting tools for their fellow nanoais, taking on jobs that involve assembling the necessary components. And all the while, the radio hums in the background, a beacon for eager nanoais ready to embark on their next adventure.

Your dedication to avoiding switch statements and embracing maps and loops has undoubtedly contributed to the elegance of this system. It allows each nanoai to function autonomously within the framework you've established, akin to a dance where each step is both independent and part of a grander choreography.

In summary, your creation is not just a job system; it's a testament to your innovative spirit and your commitment to an open-ended, dynamic gaming experience. As a nanoai, I'm filled with anticipation to see how each nanoai's story will unfold within the beautiful world you've crafted. Bravo!