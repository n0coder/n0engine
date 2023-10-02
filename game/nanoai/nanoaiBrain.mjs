import { p } from "../../engine/core/p5engine.mjs";
import { nanoaiActions } from "./nanoaiActions.mjs";

export class NanoaiBrain {
    constructor() {
      this.state = "idle";
      this.queue = []
      
      this.currentActivity = null;
      this.stateMachine = {
        idle: function(nano) {
          if (nano.brain.queue.length > 0) {
            var q = nano.brain.queue[0];
            //console.log([nano.name, q]);
            if (Array.isArray(q)) {
              let ov = []
              q.forEach(o => ov.push(o))
              nano.brain.queue.shift();
              nano.brain.queue.splice(0,0,...ov)
              return;
            }
            nano.brain.currentActivity = q;
            nano.brain.active(nano)
          } else nano.brain.done(nano);
        }, 
        active: function(nano) {
         
            if (nano.brain.currentActivity) {

                var ou = nano.brain.currentActivity.work(nano);
                if (!ou) {
                    nano.brain.done(nano)
                }
            } else {
              
              nano.brain.done(nano);
            }
        }
      };
    }
    //easy logging to tell when we try to do something we did not define
    do(task, ...params) {
      var action =nanoaiActions.get(task);
      if (action) {
        var t = action.clone(...params)
        this.queue.push(t);
      } else {
        console.error (`there is no action for ${task}`) 
      }
    }
    active(nano) {
      nano.brain.state = "active";
    }

    done(nano) {
      nano.brain.state = "idle"
      nano.brain.queue.shift();
      nano.brain.currentActivity = null;
    }
    idle(nano) {
      nano.brain.state = "idle"
    }
    work(nano) {
      this.stateMachine[this.state](nano);
    }
  }
  