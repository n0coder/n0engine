import { cloneAction } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { n0radio } from "../radio/n0radio.mjs";
import { nanoaiActions } from "./nanoaiActions.mjs";

export class NanoaiBrain {
  constructor() {
    this.state = "idle";
    this.queue = []
    this.laterQueue = []
    this.currentQueue = this.queue
    this.currentActivity = null;
    this.stateMachine = {
      idle: function (nano) {
        if (nano.brain.queue.length > 0) {
          for (let i = 0; i < nano.brain.queue.length; i++) {
            let q = nano.brain.queue[i];
            if (Array.isArray(q)) {
              nano.brain.queue.splice(i, 1, ...q);
              i += q.length - 1; // Adjust the index to skip the newly inserted elements
            }
          }
          var q = nano.brain.queue[0];
          nano.brain.currentQueue = nano.brain.queue;
          nano.brain.currentActivity = q;
          nano.brain.active(nano)
        }
        else if (nano.brain.laterQueue.length > 0) { //this is when i should refactor into a function for shared code

          nano.brain.laterQueue = nano.brain.laterQueue.filter(q => {
            if (Array.isArray(q) || q.condition(...(q.args))) return q
          }
          )
          for (let i = 0; i < nano.brain.laterQueue.length; i++) {
            let q = nano.brain.laterQueue[i];
            if (Array.isArray(q)) {
              let ov = q.map(o => ({ ...o, condition: q.condition }));
              nano.brain.laterQueue.splice(i, 1, ...ov);
              i += ov.length - 1; // Adjust the index to skip the newly inserted elements
            }
          }

          var q = nano.brain.laterQueue[0];
          if (q) {

            nano.brain.currentQueue = nano.brain.laterQueue;
            nano.brain.currentActivity = q;
            nano.brain.active(nano)
          }
        } else nano.idle(); // nano.brain.done(nano);
      },
      active: function (nano) {

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
    var action = nanoaiActions.get(task);
    if (action) {
      var t = cloneAction(action,(a,b,c)=>this.before(a,b,c, this), ...params)
      this.queue.push(t);
    } else {
      console.error(`there is no action for ${task}`)
    }
  }
  doNow(task, ...params) {
    var action = nanoaiActions.get(task);
    if (action) {
        var t = cloneAction(action,(a,b,c)=>this.before(a,b,c, this), ...params)
        this.queue.unshift(t); // Add the new task to the front of the queue
        this.currentActivity = null; // Set the new task as the current activity
        this.state = "idle"
    } else {
        console.error(`there is no action for ${task}`)
    }
 }
  doTask(task, done) {
    console.log({task, done}) 
    task.args.unshift(done);
    this.queue.push(task)
  }
  doLater(task, condition, ...params) {
    var action = nanoaiActions.get(task);
    if (action) {
      var t = cloneAction(action, (a,b,c)=>this.before(a,b,c, this), ...params)
      t.condition = condition
      this.laterQueue.splice(0, 0, t);
    } else {
      console.error(`there is no action for ${task}`)
    }
  }

  before(clone, actions, args, ths) {
    if (clone.before != undefined) {
      for (let i = 0; i < clone.before.length; i++) {
        let action = nanoaiActions.get(clone.before[i]);          
          var beforeAction = cloneAction(action, (a,b,c)=>ths.before(a,b,c, ths), ...args);
          actions.push(...beforeAction)
      }
  };
  }

  done(nano) {
    nano.brain.state = "idle"
    nano.brain.currentQueue.shift();
    nano.brain.currentActivity = null;
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
