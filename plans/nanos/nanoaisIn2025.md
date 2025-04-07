tiny robot girls made of cotton candy and how they work

```js
let nano = Nanoai("nano", 5,5)
```

## 1. Sequencing (queue)
control task flow with their brains do function(s)
queue a defined state by **name**, 
```js
n0.brain.do("action", ...args) 
```
defined in the modules jobTasks map.
```js
jobTasksa.set(action, function() {
    return { work(){} }
})
```
> closures allow ue to define seperate state objects without doing a hard copy function
or work on any object directly: 
```js
n0.brain.do({work(){}})
```

we can interrupt the current state without deleting it with 
```js
n0.brain.doNow("walk", 3, 4)
```
> they dont remove tasks from the queue until it 
--
