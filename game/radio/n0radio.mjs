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

class Radio {
    constructor () {
        this.channels = new Map([
            ["personal", new Map()],
            ["lover", new Map()],
            ["team", new Map()],
            ["friends", new Map()],
            ["general", new Channel()],
            ["jobs", new Channel()]
        ])
        this.channel = {
            items: new Inventory(),
            jobs: [],
            waypoints: [],
            objs: []
        };
    }

    findItem(item, type, key) {
        for (const [ckey, channel] of this.channels) {
            if (channel instanceof Map) {
                var iau = channel.get(key);
                if (iau) {
                    return iau.items.hasItem(item, type)
                }
            } else {
                return channel.items.hasItem(item, type)
            }
        }
    }
    findClaimItem(item, type, key) {
        for (const [ckey, channel] of this.channels) {
            if (channel instanceof Map) {
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
            if (c instanceof Map) {
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
