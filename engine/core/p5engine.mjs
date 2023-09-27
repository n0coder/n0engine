import { cosmicEntityManager } from "./CosmicEntity/CosmicEntityManager.mjs";
import { calculateDeltaTime, deltaTime, previousTime } from "./Time/n0Time.mjs";
import { backgroundColor, gameH, gameW } from "./n0config.mjs";
class P5engine {
    constructor(){
        this.p = new window.p5(this.p5);
    }

    p5(p) { 
          p.preload = function (...args) {
            cosmicEntityManager.invoke("preload", ...args);
          };
          
          p.setup = function(...args)  {
            p.createCanvas(gameW,gameH).parent("sketch-holder");
            cosmicEntityManager.invoke("setup", ...args);
           
          };
          
          p.draw = function(...args)  {
            p.background(backgroundColor);
            p.noStroke();
            calculateDeltaTime();
            
            
            cosmicEntityManager.invoke("draw", deltaTime, ...args);
          };
          
          p.mouseClicked =function (...args)  {
            cosmicEntityManager.invoke("mouseClicked", ...args);
          };
          
          p.mouseDragged =function (...args)  {
            cosmicEntityManager.invoke("mouseDragged", ...args);
          };
          
          p.mouseMoved =function (...args)  {
            cosmicEntityManager.invoke("mouseMoved", ...args);
          };
          
          p.mousePressed = function(...args)  {
            cosmicEntityManager.invoke("mousePressed", ...args);
          };
          
          p.mouseReleased = function(...args)  {
            cosmicEntityManager.invoke("mouseReleased", ...args);
          };
          
          p.mouseWheel = function(...args)  {
            cosmicEntityManager.invoke("mouseWheel", ...args);
          };
          
          p.doubleClicked = function(...args)  {
            cosmicEntityManager.invoke("doubleClicked", ...args);
          };
          
          p.windowResized = function(...args)  {
            cosmicEntityManager.invoke("windowResized", ...args);
          };
          
          p.keyPressed =function (...args)  {
            cosmicEntityManager.invoke("keyPressed", ...args);
          };
          
          p.keyReleased = function(...args)  {
            cosmicEntityManager.invoke("keyReleased", ...args);
          };
          
          p.keyTyped = function(...args)  {
            cosmicEntityManager.invoke("keyTyped", ...args);
          };
          

    }
    
}
export var p5engine = new P5engine();
export const p = p5engine.p;