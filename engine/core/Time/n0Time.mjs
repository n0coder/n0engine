import { p } from "../p5engine.ts";

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
    deltaTime =Math.min(dt, maxDeltaTime); //.1//.025 //= // 0.025 // 
    previousTime = currentTime;
    ingameTime+=deltaTime;
}