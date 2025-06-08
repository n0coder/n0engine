import { t } from "../../engine/core/Time/n0Time.mjs";
import { cloneAction as handleBefore } from "../../engine/core/Utilities/ObjectUtils.mjs";
import { p } from "../../engine/core/p5engine.mjs";
import { n0radio } from "../radio/n0radio.mjs";
import { nanoaiActions } from "./nanoaiActions.mjs";

export class NanoaiBrain {
  constructor() {
    this.state = "idle";
    this.queue = []
    this.currentActivity = null;
    this.stateMachine = {
      idle: function (nano) {
        if (nano.brain.queue.length > 0) {
          this.processQueue(nano, "queue");
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
          q.start?.(nano);
          nano.brain.currentActivity = q;
          nano.brain.active(nano);
        }
       }
    };
  }
  
  do(task, ...args) {
    let action = this.actionBuilder(task, args, (t) => { this.queue.push(t); }); 
    if (typeof task === 'string' && action)
    action.name = task
    return action
  }

  doNow(task, ...args) {
    let action = this.actionBuilder(task, args, (t) => { 
      this.queue.unshift(t);
      this.currentActivity = null; 
      this.state = "idle"
    });
    action.name = `*${task}*`
    return 
  }
  

  doBefore(targetTasks, task, ...args) {
    let action = this.doRelative(targetTasks, task, (t, index) => {
      this.queue.splice(index, 0, t); 
      this.currentActivity = null; 
      this.state = "idle"

    }, (array)=> array[0], ...args); 
     action.name = `${action?.name??"O"} -> ${task}`
    return action
  }
  doAfter(targetTasks, task, ...args) {
    let action = this.doRelative(targetTasks, task,  (t, index)  => { 
     
      this.queue.splice(index+1, 0, t);
    }, (array)=> array[array.length], ...args);  
    action.name = `${task} <| ${action?.name??"O"}`
    return action
  }


  doRelative(targetTasks, task, builder, arrayIndex, ...args) {
    let doR = (targetTask, task, args) => { 
      var index = this.queue.indexOf(targetTask);
      if (index !== -1) { 
        return this.actionBuilder(task, args, (t)=> builder(t, index)); 
      } else {
        console.error({targetTask, msg: "task not found in the queue"});
      }
    }

    let targetTask = Array.isArray(targetTasks) ? arrayIndex(targetTasks) : targetTasks
    return doR(targetTask, task, args)
  }
  remove(task) {
    var i = this.queue.indexOf(task);
    this.queue.splice(i, 1);
  }
  actionBuilder(task, args, found) {
    if (typeof task === 'string') {
    var action = nanoaiActions.get(task);
    if (!action) {
      console.error(`there is no action for ${task}`)
      return null; // i do hate the "guard clauses" syntax 
    }
    var task = action(...args)
    try { throw new Error("call stack") }
    catch (callstack) {task.callstack = callstack}
    let doBefore = (task,actions,args) => this.before(task,actions, args, this, task)
    let o = handleBefore(task, doBefore, ...args); //o is an array (bc of before returning multiple tasks) 
    found(o);
    return (o.length === 1) ? o[0] : o
  } else {
      if (args[0]) task.done = args[0] 
      found(task)

    try { throw new Error("call stack") }
    catch (callstack) {task.callstack = callstack}
    return task;
  }
  }
  before(clone, actions, args, ths, task) {
    if (clone.before != undefined) {
      for (let i = 0; i < clone.before.length; i++) {
        let action = nanoaiActions.get(clone.before[i]);  
        action = action(...args)
        if (task.name)
             action.name = `${action?.name??"O"} -> ${task.name}`
          var beforeAction = handleBefore(action, (a,b,c)=>ths.before(a,b,c, ths), ...args);
          actions.push(...beforeAction)
      }
  };
  }

  done(nano) {
    nano.brain.state = "idle"
    nano.brain.queue.shift();
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
