import { p } from "../../engine/core/p5engine.mjs";

export class NanoaiBrain {
    constructor() {
      this.state = "active";
      this.currentActivity = null;
      this.stateMachine = {
        idle: function(nano) {
          //find something to do
          //check battery
          //call radio
          //check feelings (wants to do hobby or chat with friend)?
        }, 
        active: function(nano) {
            if (nano.brain.currentActivity) {
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
  