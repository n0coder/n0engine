import { cosmicEntityManager } from "../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { worldGrid } from "../engine/grid/worldGrid.mjs";
import { Crop } from "./farm/crop.mjs";
import { GeneticSquare } from "./geneticTest/geneticSquare.mjs";

worldGrid.tileSize = 64;

/*
var crop = new Crop(3,1);
cosmicEntityManager.addEntity(crop);
*/

/*
var copy = crop.copy(3,2);
cosmicEntityManager.addEntity(copy);
*/

//i want to try to write a manual genetic algorithm



var gSquare=new GeneticSquare(255, 255, 255);
gSquare.x = 2;
gSquare.y = 2;
gSquare.selected =MainSquareSelected;
 /*(square) => {
    console.log(square);
}*/
cosmicEntityManager.addEntity(gSquare);

var vec1 =genPalette(gSquare, 2,4,20);
vec1 = genPalette(vec1, 2,5,20);
vec1 = genPalette(vec1, 2,6,20);
var vec2 =genPalette(vec1, 2,7,20);
vec2 = genPalette(vec2, 2,8,20);
vec2 = genPalette(vec2, 2,9,20);
var vec3 =genPalette(vec2, 2,10,20);
vec3 = genPalette(vec3, 2,11,20);
vec3 = genPalette(vec3, 2,12,20);

function MainSquareSelected(square) {
    console.log(["main", square]);
}
function CopySquareSelected(square) {
    console.log(["copy", square]);
}
function genPalette(copec, x,y,o, t=10) {    
    for (let i = 0; i < o; i++) 
        copec = MutateCopy(copec, x+i, y, t);    
    return copec;
}

function MutateCopy(origin,x,y,t) {
    var copy = origin.mutateCopy(t)
    copy.x = x;
    copy.y = y;
    copy.selected = CopySquareSelected;
    cosmicEntityManager.addEntity(copy);
    return copy;
}
