import { gameH, gameW } from "../../engine/core/n0config.mjs";
import { p } from "../../engine/core/p5engine.ts";
import {inverseLerp, lerp} from "../../engine/n0math/ranges.mjs"
export class DistanceVisualizer {
    constructor(color, color2) {
        this.color = color;
        this.color2 = color2;
    }
    draw() {
        p.fill(0);
        //p.stroke(0)
        p.textSize(20);

        const hueMax = 360;
        const satMax = 100;
        const valMax = 100;


        let {r,g,b} = this.color.color;
        let color = [r,g,b] 
        let [ccr, ccg, ccb] = this.color2.color; 
        var current = this.rgbToHsv(r,g,b);
        var target = this.rgbToHsv(ccr, ccg, ccb);
        var hue = Math.abs(target.h - current.h) 
        var sat = Math.abs(target.s - current.s)
        var val = Math.abs(target.v - current.v)

         hue = 1- (hue / hueMax);
         sat = 1- (sat / satMax);
         val =1- ( val / valMax);
         let msg = ""
        if ((hue <= 0.05||hue >= 0.95)&& sat >= .95&&val >= .95) {
           msg = "great\n" 
        } else if ((hue <= 0.1||hue >= 0.9)&& sat >= .9&&val >= .9) {
            msg = "nice\n"
        } else if ((hue <= 0.2||hue >= 0.8)&& sat >= .8&&val >= .8)
            msg = "close\n"
            else msg = "";
        p.text(`${msg}hue: ${hue}\nsat: ${sat}\nval: ${val}`, 570,280);
    }
     distance(color1, color2) {
        let rDiff = color1[0] - color2[0];
        let gDiff = color1[1] - color2[1];
        let bDiff = color1[2] - color2[2];
      
        let squaredDiff = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
        let distance = Math.sqrt(squaredDiff);
      
        return distance;
      }
      rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const maxc = Math.max(r, g, b);
        const minc = Math.min(r, g, b);
        const c = maxc - minc;
        const s = (c / maxc) * 100;
        let h;
    
        if (c === 0) {
            h = 0;
        } else if (maxc === r) {
            h = (60 * ((g - b) / c)) % 360;
        } else if (maxc === g) {
            h = (60 * ((b - r) / c)) + 120;
        } else {
            h = (60 * ((r - g) / c)) + 240;
        }
    
        const v = maxc * 100;
        return { h, s, v };
    }
    
}