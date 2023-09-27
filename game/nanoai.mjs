import { p } from "../engine/core/p5engine.mjs";
export class Nanoai {
    constructor() {
         p.loadImage('../nanoai.png', img => {
            this.img = img;
            console.log('Image loaded');
          });
    }
    draw() {
        if (this.img) {
            p.image(this.img, 42, 97);
        }
    }
}