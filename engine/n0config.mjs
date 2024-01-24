//forced canvas size, kept since p5.js's width and height variables are window based
export let gameH = 512//window.innerHeight;
export let gameW = 512//window.innerWidth// gameH//*1.77777;
export let gameScreenMode = new Map([
	["square", (wh) => {
		gameH = wh, gameW= wh;
	}],
	["fullCanvas", (wh) => {
		gameH = window.innerHeight, gameW= window.innerWidth;
	}],
	["fullHeight", (wh) => {
		gameH = window.innerHeight, gameW= window.innerWidth*.75;
	}],
	["aspectRatio", (width, height, scale) => {
		let ratio = (width/height)*scale
		gameH = scale, gameW= ratio;
	}]
]);
gameScreenMode.get("fullCanvas")(512) 
// someone saw my idea and said that my code causes performance issues
// this ocde is run once, it runs when the player hits a button


//global scene variables
export const backgroundColor = [33,33,33];
export const defaultScale = 2;


//this is a quirk of the original implementation of the engine
//https://github.com/n0coder/goblins-haven
//it is subject to removal, as i work on design systems
export const possibleTiles = [];