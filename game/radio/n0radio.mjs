//start outside a class, like usual

import { worldGrid } from "../../engine/grid/worldGrid.mjs";
import { Circle } from "../farm/circle.mjs";
import { Inventory } from "../shared/Inventory.mjs";

export class Channel {
    constructor() {
        this.items = new Inventory();
        this.jobs = []
        this.waypoints = []
        this.objs = []
    }
}

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
        
            let instance = this.instances.get(key.lover) || this.instances.get(key);
            if (!instance) return
            let itema = instance.items.hasItem(item, type)
            if (itema) return itema; //return if we find item
        
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
    constructor () {
        this.channels = new Map([
            ["personal", new Map()],
            ["lover", loverChannel],
            ["team", new Map()],
            ["friends", friendChannel],
            ["general", new Channel()],
            ["jobs", new Channel()]
        ])
        this.friendsList = new Map();
    }
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
      
    postItem(channel, item, key) {
        let c = this.channels.get(channel);
        if (c) {
            if (c.postItem) {
                c.postItem(item, key)
            } else if (c instanceof Map) {
                var chan = c.get(key);
                if (!chan) {
                    chan = new Channel()
                    c.set(key, chan);
                }
                chan.items.add(item)
            } else {
                c.items.add(item)
            }
        }
    }
}
export let n0radio = new Radio();
