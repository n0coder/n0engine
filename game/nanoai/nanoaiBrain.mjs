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
            nano.brain.currentActivity = nano.brain.queue.shift()
            nano.brain.active(nano)
          } else nano.idle();
        }, 
        active: function(nano) {
            if (nano.brain.currentActivity) {
                //console.log(nano.brain);
                var ou = nano.brain.currentActivity.work(nano);
                if (!ou) {
                    nano.brain.idle(nano)
                    nano.brain.currentActivity = null;
                }
            } else {
              nano.brain.idle(nano);
            }
        }
      };
    }
    do(task, ...params) {
      var t = nanoaiActions.get(task).clone(...params)
      this.queue.push(t);
    }
    active(nano) {
      nano.brain.state = "active";
    }
    idle(nano) {
      nano.brain.state = "idle"
    }
    work(nano) {
      this.stateMachine[this.state](nano);
    }
  }
  