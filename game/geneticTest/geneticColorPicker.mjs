//i want to try to write a manual genetic algorithm
import { cosmicEntityManager } from "../../engine/core/CosmicEntity/CosmicEntityManager.mjs";
import { GeneticSquare } from "./geneticSquare.mjs";

let mut = 15;

var tsquare = new TargetColorRect(10, 0, 56);
cosmicEntityManager.addEntity(tsquare);

let copies = []
var gSquare=new GeneticSquare(255, 255, 255, 7,4,56);
gSquare.selected =mainSquareSelected;
cosmicEntityManager.addEntity(gSquare);

setBoard(255, 255, 255);
function setBoard(r,g,b) {
    gSquare.r = r;
    gSquare.g = g;
    gSquare.b = b;

    var ol = mutationStrand(gSquare, 1,0, 2, mut);
    var ol2 = mutationStrand(gSquare, -1,0, 2, mut);
    var ol3= mutationStrand(gSquare, 0,1, 2, mut);
    var ol4 =mutationStrand(gSquare, 0,-1, 2, mut);
    mutationStrand(ol, 1,0, 2, mut*2);
    mutationStrand(ol2, -1,0, 2, mut*2);
    mutationStrand(ol3, 0,1, 2, mut*2);
    mutationStrand(ol4, 0,-1, 2, mut*2);
    var diag = mutationStrand(gSquare, 1,1, 2, mut);
    var diag2 = mutationStrand(gSquare, -1,-1, 2, mut);
    var diag3 = mutationStrand(gSquare, -1,1, 2, mut);
    var diag4 = mutationStrand(gSquare, 1,-1, 2, mut);
    mutationStrand(diag, 1,0, 2, mut*2);
    mutationStrand(diag, 0,1, 2, mut*2);
    mutationStrand(diag2, -1,0, 2, mut*2);
    mutationStrand(diag2, 0,-1, 2, mut*2);
    mutationStrand(diag3, -1,0, 2, mut*2);
    mutationStrand(diag3, 0,1, 2, mut*2);
    mutationStrand(diag4, 1,0, 2, mut*2);
    mutationStrand(diag4, 0,-1, 2, mut*2);


}

function mutationStrand(cx, vx=1,vy=0, len=1, mut=30) {    
    for (let i = 0; i < len; i++) {
        cx= mutateCopy(cx, cx.x+(vx),cx.y+(vy),mut)
    }
    return cx
}

function mainSquareSelected(square) {
    setBoard(square.r, square.g, square.b);
}
function copySquareSelected(square) {
    setBoard(square.r, square.g, square.b);
}
function genPalette(copec, x,y,o, t=10) {    
    for (let i = 0; i < o; i++) 
        copec = mutateCopy(copec, x+i, y, t);    
    return copec;
}
function mutateCopy(origin,x,y,t) { 
    // Find if a copy already exists at this position
    let copy = copies.find(copy => copy.x === x && copy.y === y);
    if (copy) {
        // If copy does exist at this position, regenerate it using origin
        copy.regenerate(origin, t);
    } else {
        // Else if no copy exists at this position x and y, make a new one
        copy = origin.mutateCopy(t);
        copy.x = x;
        copy.y = y;
        copy.selected = copySquareSelected;
        copies.push(copy);
        cosmicEntityManager.addEntity(copy);
    }

    return copy;
}