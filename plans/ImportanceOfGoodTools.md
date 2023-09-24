# The Importance of Good Tools

### grids
often, abstract forms of space are hard to understand

wrapping your head around navigating warped space can suck

so we can write tools, to do the work for us.

in one case we will want to check if a point is inside the grid cell
```javascript
if (mouseX > x && mouseX < x+tileSize && mouseY > y && mouseY < y+tileSize) {
    //do something if mouse is inside of the grid cell
}
```

it is not fun to rewrite the directionality, 
so, we can write it directly inside the grid

```javascript
function inTile(i, o) {
    return i > x && i < x+tileSize && o > y && o < y+tileSize
}

if (inTile(mouseX, mouseY)) {
    //do something if mouse is inside of the grid cell
}
```
 you can bundle this function inside the grid, so you don't need to convert sizes manually...
 easier on the brain, easier to reason with.