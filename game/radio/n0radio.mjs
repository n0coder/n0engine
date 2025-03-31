//start outside a class, like usual

import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Circle } from "../farm/circle.mjs";
import { Inventory } from "../shared/Inventory.mjs";
import { bestSearch } from "./jobSystem.mjs";

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
        job.done.add(this,(j,n)=>this.jobDone(j,n))
        job.failed.add(this,(j,n)=>this.jobFail(j,n))
        job.nanoAssigned.add(this, (j, nano)=>{
            this.nanosSearching.delete(nano); //remove from searching
        })
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
        this.nanosWorking.delete(job.nano)
    }
    jobFail(job) {
        console.log("job failed", job)
        this.nanosWorking.delete(job.nano)
    }
    findJob(key) {
        if (this.nanosSearching.get(key)) return;
        this.nanosSearching.set(key,1);

        let jobu = this.nanosWorking.get(key)
        if (jobu) {
            jobu.hireNano(key, true)
            return;
        }

        console.log("(nano searching): nano is searching")
       
        function rateJobs(jobs, nano, channel) {
            let jobScores = [];
            let best = bestSearch([nano], jobs, (n,j)=> j.rateJob(n) )
            jobScores.push([best, channel])
            return jobScores
        }
        
        let jobScores = null;
        for (const [ckey, channel] of this.channels) {
            if (channel.getJobs) {
                let jobs = channel.getJobs(key);
                if (jobs)
                    jobScores =rateJobs(jobs, key, channel)
            }else if (channel instanceof Map) {
                var c = channel.get(key);
                if (c) 
                    jobScores =rateJobs(c.jobs, key, channel)
            } else {
                jobScores =rateJobs(channel.jobs, key, channel)
            }
        }
        if (!jobScores || jobScores.length === 0) {
            console.log("(nano searching): no jobs right now", key)
            return;
        }
        let job = jobScores[0][0].get(key).b
        this.removeJob(jobScores[0][1], job, key)
        job.hireNano(key, true)
        this.nanosWorking.set(key, job)
    }
    constructor(){
        this.nanosSearching = new Map();
        this.nanosWorking = new Map()
        this.channels = new Map();
        this.friendsList = new Map();
    }
}
export let n0radio = new Radio();
globalThis.n0radio = n0radio
