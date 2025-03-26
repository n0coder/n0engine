//start outside a class, like usual

import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Circle } from "../farm/circle.mjs";
import { Inventory } from "../shared/Inventory.mjs";
import { bestSearch, nanoStageSearch, scoreStageTask } from "./jobSystem.mjs";

export class Channel {
    constructor() {
        this.items = new Inventory();
        this.jobs = []
        this.waypoints = []
        this.objs = []
    }
}
//this implementation is really annoying and i will remake this because it's so annoying
let friendChannel = {
    instances: new Map(),
    findItem: function(item, type, key, friends) {
        if (friends != null)
        for(var friend of friends) {
            let instance = this.instances.get(friend);
            if (!instance) continue;
            let itema = instance.items.hasItem(item, type)
            if (itema) return itema; //return if we find item
        }
    },
    getJobs: function(key, friends) {
        if (friends != null)
        for(var friend of friends) {
            let instance = this.instances.get(friend);
            if (!instance) continue;
           return instance.jobs; //return if we find item
        }
    },
    findClaimItem: function(item, type, key, friends) {
        if (friends != null)
        for(var friend of friends) {
            let instance = this.instances.get(friend);
            if (!instance) continue;
            let itema = instance.items.hasItem(item, type)
            if (itema) {
                instance.items.remove(itema);
                return itema; //return if we find item
            }
        }
    },
    postItem: function(item, key) {
        let instance = this.instances.get(key);
        if (!instance) {
            instance = new Channel()
            this.instances.set(key, instance);
        }
        instance.items.add(item);
    }
}
let loverChannel = {
    instances: new Map(),
    findItem: function(item, type, key) {
            if (!key?.lover) return;
            let instance = this.instances.get(key.lover) || this.instances.get(key);
            if (!instance) return;
            let itema = instance.items.hasItem(item, type)
            if (itema) return itema; //return if we find item
        
    },
    getJobs: function(item, type, key) {
        if (!key?.lover) return;
        let instance = this.instances.get(key.lover) || this.instances.get(key);
        if (!instance) return;
        return instance.jobs
    
},
    findClaimItem: function(item, type, key) {
        let instance =  this.instances.get(key.lover) || this.instances.get(key);
        if (!instance) return
            let itema = instance.items.hasItem(item, type)
            if (itema) {
                instance.items.remove(itema);
                return itema; //return if we find item
            }
        
    },
    postItem: function(item, key) {
        let instance = this.instances.get(key);
        if (!instance) {
            instance = new Channel()
            this.instances.set(key, instance);
        }
        instance.items.add(item);
    }
}
class Radio {
   addFriend(nano, friend) {
    if (!this.friendsList.has(nano)) {
        this.friendsList.set(nano, new Set([nano]));
    }
    if (!this.friendsList.has(friend)) {
        this.friendsList.set(friend, new Set([friend]));
    }
       this.friendsList.get(nano).add(friend);
       this.friendsList.get(friend).add(nano);
   }
    findItem(item, type, key) {
        for (const [ckey, channel] of this.channels) {
            if (channel.findItem != null) {
                let itema = channel.findItem(item, type, key, this.friendsList.get(key))
                if (itema) return itema;
            } else if (channel instanceof Map) {
                var iau = channel.get(key);
                if (iau) {
                    let itema =  iau.items.hasItem(item, type)
                    if (itema) return itema;
                }
            } else {
                let itema =  channel.items.hasItem(item, type)
                if (itema) return itema;
            }
        }
    }
    //find claim is the tech that will pick an item and immediately take it off the radio
    //this makes it so that other ais can't take the item that another ai took
    findClaimItem(item, type, key) {
        for (const [ckey, channel] of this.channels) {
            if (channel.findClaimItem != null) {
                let itema = channel.findClaimItem(item, type, key, this.friendsList.get(key))
                if (itema) return itema;
            } else if (channel instanceof Map) {
                var iau = channel.get(key);
                if (iau) {
                    let a = iau.items.hasItem(item, type);
                    if (a) {
                        iau.items.remove(a);
                    return a ;
                    }
                }
            } else  if (channel != null) {
               let a = channel.items.hasItem(item, type);
                    if (a){ channel.items.remove(a);
                    return a;
                    }
               
            }
        }
        return null;
      }
    findCreateChannel(channel, key) {
        let c = this.channels.get(channel);
        if (c) {
            if (c instanceof Map) {
                let chan = c.get(key);
                if (!chan) {
                    chan = new Channel()
                    c.set(key, chan);
                }
                return chan;
            } else {
                return c;
            }
        } else {
            if (key != null) {
                c = new Map()
                this.channels.set(channel, c)
                let chan = new Channel()
                c.set(key, chan)
                return chan;
            } else {
                let chan = new Channel()
                this.channels.set(channel, chan)
                return chan;
            }
        }

    }
    findChannel(channel, key) {
        let c = this.channels.get(channel);
        if (c && c instanceof Map) {
            return c.get(key);
        } else if (c) {
            return c;
        } else {
            return null; // Return null if the channel doesn't exist
        }
     }
     
    postItem(channel, item, key) {
        let c = this.findCreateChannel(channel, key);
        if (c) {
            if (c.postItem) {
                c.postItem(item, key)
            } else {
                c.items.add(item)
            }
        }
    }
    findNano(job, channel, key){
        if (n0radio.nanosSearching.size === 0) return;
        let nanos = n0radio.nanosInChannel(channel, key)
        job.hireNanos(nanos)
    }
    postJob(channel, job, key) {
        let c = this.findCreateChannel(channel, key);
        if (c) {
            //if c is a type with a custom post, we use that version instead of directly pushing to the channel list
            if (c.postJob) { 
                c.postJob(job, key)
            } else {
                c.jobs.push(job)
            }
            this.findNano(job, channel, key) //we want to tell any nanos currently waiting, that they can start working
        }
        if (key)
        job.keys.push(key)
        job.done.add(()=>this.jobDone(job))
        job.failed.add(()=>this.jobFail(job))
        job.nanoAssigned.add(()=>{
            this.nanosSearching.delete(nano); //remove from searching
        })
        job.hire = ()=> {this.findNano(job, channel, key)}
    }
    removeJob(channel, job, key) {
        let c = this.findChannel(channel, key);
        console.log({c, channel, key})
        if (c) {
            
            //if c is a type with a custom post, we use that version instead of directly pushing to the channel list
            if (c.removeJob) { 
                c.removeJob(job, key)
            } else {
                let i = c.jobs.indexOf(job)
                c.jobs.splice(i, 1)
            }
        }
    }
    
    nanosInChannel(channel, c) {
        let nanos = Array.from(this.nanosSearching.keys())
        return nanos.filter((n) => (this.findChannel(channel, n) === this.findChannel(channel, c)));
    }
    jobDone(job) {
        console.log("job done", job)
        
        for (const [ckey, channel] of this.channels) {
            if (job.keys.length > 0) {
            for (let key of job.keys)
            this.removeJob(ckey, job, key)
            } else this.removeJob(ckey, job)
        }
    }
    jobFail(job) {
        console.log("job failed", job)
    }
    findJob(key) {
        //what would we do if multiple nanos are a key
        //so we gotta find jobs where both nanos can work together well
        //say we insert nanoai team, they will queue up for jobs together
        if (this.nanosSearching.get(key)) return;
        this.nanosSearching.set(key,1);
        console.log("(nano searching): nano is searching")
        let jobScores = [];
        function rateJobs(jobs, nano) {
            for (const job of jobs) {
                let stage = job.stages[job.stage]
                if (stage.tasks.length === 0) continue; //no tasks in job available? skip

                let best = bestSearch([nano], stage.tasks, (n,t)=> scoreStageTask(t,n,stage))
                jobScores.push([job, best])
            }
        }
        
        for (const [ckey, channel] of this.channels) {
            if (channel.getJobs) {
                let jobs = channel.getJobs(key);
                if (jobs)
                    rateJobs(jobs, key)

            }else if (channel instanceof Map) {
                var c = channel.get(key);
                if (c) 
                    rateJobs(c.jobs, key)
                
            } else {
                rateJobs(channel.jobs, key)

            }
        }
        
        if (jobScores.length === 0) {
            console.log("(nano searching): no jobs right now", key)
            return;
        }
        let job = bestSearch([key], jobScores, (k, j)=> {
            return j[1].get(key).score
        }, true).get(key);

        let stage = job[0].stages[job[0].stage]
        let task = job[1].get(key).b
        stage.assignTask(job[0], stage, task, key);
    }
    constructor(){
        this.nanosSearching = new Map();
        this.channels = new Map();
        this.friendsList = new Map();
    }
}
export let n0radio = new Radio();
globalThis.n0radio = n0radio
