# farm game
  1. make a square, 
  2. click it to plant a seeds
  3. wait for it to grow
  4. it will turn yellow when grown
  5. then we can click to harvest it
  6. the drop will pop off, and we can pick it up
### and
  1. an ai can walk to empty square
  2. ai uses it to plant the seed
  2. wait for it to grow
  3. the ai will be told when the crop grows
  4. it will walk to harvest it
  5. then it'll pop into the ais hands

so we need a system that can be used from multiple other systems

> you may be wondering how? i wondered this too
> and then i rememembered, sandbox systems are unmanaged systems

## Managed systems vs unmanaged
### managed
  * high level overview
  * manager based gameplay loop
  * logic is done by a shared system

an example of a managed system is tic tac toe. where the board controls gameplay. what i mean is x goes first o goes second.
the code is like
```javascript
board.drop(0,0); //x drops top left
board.drop(0,1); //o drops top center
board.drop(0,0); //x failed to drop due to the slot being taken already (by x) 
```
the board controls who drops when, 
you ask the board if it's your turn basically


### unmanaged
  * per object view
  * self contained gameplay loop
  * logic is done by the object itself


