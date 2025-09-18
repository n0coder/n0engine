import { cosmicEntityManager } from "./CosmicEntity/CosmicEntityManager.mjs";
import { calculateDeltaTime, deltaTime, previousTime } from "./Time/n0Time.mjs";
import { backgroundColor, gameH, gameW } from "../n0config.mjs";
import { } from "./Utilities/MapUtils.mjs"
import * as p5 from "p5";

function cleanStackLine(line) {
    const match = line.match(/at\s+(.*?)\s+\((.*):(\d+):\d+\)/i);
    if (!match) return line.trim();
    let [, fnName, url, lineNum] = match;
    url = url.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, "");
    return `${lineNum} @ (${url}) ${fnName}`;
}
function cleanStackShort(line) {
    const match = line.match(/at\s+(.*?)\s+\((.*):(\d+):\d+\)/i);
    if (!match) return line.trim();

    let [, , url, lineNum] = match;
    // Strip everything but the filename and extension
    url = url.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, "");
    url = url.split("/").pop(); // just the file name

    return `${url}:${lineNum}`;
}

[
    "createA", "createAudio", "createButton", "createCanvas",
    "createCheckbox", "createColorPicker", "createDiv",
    "createImg", "createInput", "createP", "createRadio",
    "createElement", "createFileInput", "createImage",
    "createSelect", "createSlider", "createSpan", "createVideo"
].forEach(fn => {
    const orig = window.p5.prototype[fn];
    if (typeof orig === "function") {
        window.p5.prototype[fn] = function (...args) {
            const elt = orig.apply(this, args);
            // Tag with callsite — adjust stack index if needed
            let slice = new Error().stack.split("\n")[2].trim();

            elt.elt.line = cleanStackLine(slice);
            elt.attribute("code", cleanStackShort(slice) )
            
            return elt;
        };
    }
});

export let canvas: Element //give TS the type... idk why js and ts are like this
class P5engine {
    p: p5;
    constructor(){
        this.p = new window.p5(this.p5);
    }

    p5(p) { 
        p.preload = function (p) {
            cosmicEntityManager.invoke("preload", p);
        };
    
        p.setup = function()  {
        window.p5.disableFriendlyErrors = true;
        document.getElementById('loading').style.display = 'none';
        p.webgl = false;
        if (p.webgl) p.text = ()=>{}
        canvas = p.createCanvas(gameW, gameH, p.webgl ? p.WEBGL : undefined).parent("sketch-holder");
        cosmicEntityManager.invoke("setup");
        canvasSetup=true;
    };

    p.draw = function()  {
        p.background(backgroundColor);
        p.noStroke();
        if (p.webgl)
        p.rotateX(2.141592 / 3);
        calculateDeltaTime();
        cosmicEntityManager.invoke("draw", deltaTime);
    };

    p.mouseClicked = function()  {
        cosmicEntityManager.invoke("mouseClicked");
    };

    p.mouseDragged = function()  {
        cosmicEntityManager.invoke("mouseDragged");
    };

    p.mouseMoved = function()  {
        cosmicEntityManager.invoke("mouseMoved");
    };

    p.mousePressed = function()  {
        cosmicEntityManager.invoke("mousePressed");
    };

    p.mouseReleased = function()  {
        cosmicEntityManager.invoke("mouseReleased");
    };

    p.mouseWheel = function(event)  {
        cosmicEntityManager.invoke("mouseWheel", event);
    };

    p.doubleClicked = function()  {
        cosmicEntityManager.invoke("doubleClicked");
    };

    p.windowResized = function()  {
        cosmicEntityManager.invoke("windowResized");
    };

    p.keyPressed = function(key, keyCode)  {
        cosmicEntityManager.invoke("keyPressed", key, keyCode);
    };

    p.keyReleased = function(key, keyCode)  {
        cosmicEntityManager.invoke("keyReleased", key, keyCode);
    };

    p.keyTyped = function(key, keyCode)  {
        cosmicEntityManager.invoke("keyTyped", key, keyCode);
    };
}

}
export var p5engine = new P5engine();
export const p: p5 = p5engine.p;

//this provides a way to call setup to generate a canvas after the engine is already created
//this fixes the issue where loading the game, does not create a canvas
export var canvasSetup = false;
document.addEventListener('visibilitychange', 
    function() {
        if (!document.hidden && !canvasSetup) {
            p.setup();
        }
    }
);