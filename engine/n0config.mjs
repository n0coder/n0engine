//forced canvas size, kept since p5.js's width and height variables are window based
export const gameH = 512;
export const gameW = gameH*1.77777;

//global scene variables
export const backgroundColor = [33,33,33];
export const defaultScale = 4;


//this is a quirk of the original implementation of the engine
//https://github.com/n0coder/goblins-haven
//it is subject to removal, as i work on design systems
export const possibleTiles = [];