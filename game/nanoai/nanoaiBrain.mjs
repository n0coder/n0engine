import { p } from "../../engine/core/p5engine.mjs";

export class NanoaiBrain {
    constructor() {
      this.state = "active";
      this.queue = []
      this.currentActivity = null;
      this.stateMachine = {
        idle: function(nano) {
          if (nano.brain.queue.length > 0) {
            nano.brain.currentActivity = nano.brain.queue.shift()
            nano.brain.state = "active";
          } else nano.idle();
        }, 
        active: function(nano) {
            if (nano.brain.currentActivity) {
                console.log(nano.brain);
                var ou = nano.brain.currentActivity.work(nano);
                if (!ou) {
                    nano.brain.state = "idle";
                    nano.brain.currentActivity = null;
                }
            }
        }
      };
    }
  
    work(nano) {
      this.stateMachine[this.state](nano);
    }
  }
  