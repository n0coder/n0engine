import { cosmicEntityManager } from "./CosmicEntity/CosmicEntityManager.mjs";
import { calculateDeltaTime, deltaTime, previousTime } from "./Time/n0Time.mjs";
import { backgroundColor, gameH, gameW } from "../n0config.mjs";
class P5engine {
    constructor(){
        this.p = new window.p5(this.p5);
    }

    p5(p) { 
      p.preload = function (p) {
          cosmicEntityManager.invoke("preload", p);
      };
  
      p.setup = function()  {
          document.getElementById('loading').style.display = 'none';
          p.createCanvas(gameW, gameH).parent("sketch-holder");
          cosmicEntityManager.invoke("setup");
          canvasSetup=true;
      };
  
      p.draw = function()  {
          p.background(backgroundColor);
          p.noStroke();
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
export const p = p5engine.p;

//this provides a way to call setup to generate a canvas after the engine is already created
//this fixes the issue where loading the game, does not create a canvas
export var canvasSetup = false;
document.addEventListener('visibilitychange', function() {
  if (!document.hidden && !canvasSetup) {
      p.setup();
  }
});