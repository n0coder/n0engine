import { p } from "../../engine/core/p5engine.mjs";
import { nanoaiActions } from "./nanoaiActions.mjs";

export class NanoaiBrain {
    constructor() {
      this.state = "active";
      this.queue = []
      this.currentActivity = null;
      this.stateMachine = {
        idle: function(nano) {
          if (nano.brain.queue.length > 0) {
            var q = nano.brain.queue[0];
            if (Array.isArray(q)) {
              q.forEach(o => nano.brain.queue.push(o))
              nano.brain.queue.shift();
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
                    nano.brain.currentActivity = null;
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
    }
    idle(nano) {
      nano.brain.state = "idle"
    }
    work(nano) {
      this.stateMachine[this.state](nano);
    }
  }
  