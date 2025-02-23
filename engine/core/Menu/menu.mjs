import { p } from "../p5engine.mjs";

class Menu {
    constructor (selector) {
        this.menu = p.select(selector);
        this.shown = false;
    }
    show() {
        this.menu.style("width", "256px"); 
        this.shown = false;
    }
    hide() {
        this.menu.style("width", "0px"); 
        this.shown = true;
    }
    add(item) {
        item.parent(this.menu)
    }
}
export let leftMenu = new Menu("#left-menu");
export let rightMenu = new Menu("#right-menu");