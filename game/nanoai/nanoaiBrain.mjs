import { cloneAction as handleBefore } from "../../engine/core/Utilities/ObjectUtils.mjs";
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
          this.processQueue(nano, "queue");
        }
        else if (nano.brain.laterQueue.length > 0) { //this is when i should refactor into a function for shared code
          nano.brain.laterQueue = nano.brain.laterQueue.filter(q => { //AHAHAHAHAHAHAHA it's been months since i said that
            if (Array.isArray(q) || q.condition(...(q.args))) return q
          })
          this.processQueue(nano, "laterQueue");
        } 
        else nano.idle(); 
      },
      active: function (nano) {

        if (nano.brain.currentActivity) {
          var ou = nano.brain.currentActivity.work(nano);
          if (!ou) nano.brain.done(nano)
          
        } else {
          nano.brain.done(nano);
        }
      }, 
      processQueue(nano, queue) {
        queue = nano.brain[queue];
        for (let i = 0; i < queue.length; i++) {
          let q = queue[i];
          if (Array.isArray(q)) {
            queue.splice(i, 1, ...q);
            i += q.length - 1;
          }
        }
        var q = queue[0];
        if (q) {
          nano.brain.currentQueue = queue;
          nano.brain.currentActivity = q;
          nano.brain.active(nano);
        }
       }
    };
  }
  
  //easy logging to tell when we try to do something we did not define
  do(task, ...params) {
    var action = nanoaiActions.get(task);
    if (action) {
      action = action(...params)//calls the closure
      var t = handleBefore(action,(a,b,c)=>this.before(a,b,c, this), ...params) //deep copies the object so it can modify any defined data structures
      this.queue.push(t);
    } else {
      console.error(`there is no action for ${task}`)
    }
  }
  doNow(task, ...params) {
    var action = nanoaiActions.get(task);
    if (action) {
        action = action(...params)
        var t = handleBefore(action,(a,b,c)=>this.before(a,b,c, this), ...params)
        this.queue.unshift(t); // Add the new task to the front of the queue
        this.currentActivity = null; // Set the new task as the current activity
        this.state = "idle"
    } else {
        console.error(`there is no action for ${task}`)
    }
 }
 //
 doBefore(targetTask, task, ...params) {
  var index = this.queue.indexOf(targetTask);
  if (index !== -1) {
    var action = nanoaiActions.get(task);
    if (action) {
      
      action = action(...params);
      var t = handleBefore(action, (a, b, c) => this.before(a, b, c, this), ...params);
      this.queue.splice(index, 0, t);

      //since this happens before the selected activity finishes, we exit the activity
      this.currentActivity = null;
      this.state = "idle"
    } else {
      console.error(`there is no action for ${task}`);
    }
  } else {
    console.error(targetTask, "task not found in the queue");
  }
 }
 doAfter(targetTask, task, ...params) {
  var index = this.queue.indexOf(targetTask);
  if (index !== -1) {
    var action = nanoaiActions.get(task);
    if (action) {
      action = action(...params);
      var t = handleBefore(action, (a, b, c) => this.before(a, b, c, this), ...params);
      this.queue.splice(index + 1, 0, t);
    } else {
      console.error(`there is no action for ${task}`);
    }
  } else {
    console.error(targetTask, "task not found in the queue");
  }
 }
 
  doTask(task, done) {
    if (done && task.args)
      task.args.unshift(done);
    this.queue.push(task)
  }
  doLater(task, condition, ...params) {
    var action = nanoaiActions.get(task);
    if (action) {
      action = action(...params)
      var t = handleBefore(action, (a,b,c)=>this.before(a,b,c, this), ...params)
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
        action = action(...args)
          var beforeAction = handleBefore(action, (a,b,c)=>ths.before(a,b,c, ths), ...args);
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
