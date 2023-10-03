import { p } from "../p5engine.mjs";

export let maxDeltaTime = 0.5;
export let deltaTime = 0;
export let previousTime = 0;
export function calculateDeltaTime() {
    let currentTime = p.millis();
    var dt = (currentTime - previousTime)/1000;
    //testing if deltatime calculation is breaking my game some
    deltaTime = .025 //= Math.min(dt, maxDeltaTime);
    previousTime = currentTime;
}