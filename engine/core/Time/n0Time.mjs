import { p } from "../p5engine.mjs";

export let maxDeltaTime = 0.5;
export let deltaTime = 0;
export let previousTime = 0;
export let ingameTime = 0;
export let ingameTimeSpeed =1
export let tickSpeed = 100;
export let ticks = 0;
export let t=0;
export function calculateDeltaTime() {
    let currentTime = p.millis();
    if (p.millis() - t > tickSpeed) {
        ticks++;
        t = p.millis();
    }


    var dt = (currentTime - previousTime)/1000;
    //testing if deltatime calculation is breaking my game some
    deltaTime = .025 //=Math.min(dt, maxDeltaTime); // 0.025 // 
    previousTime = currentTime;
    ingameTime+=deltaTime;
}