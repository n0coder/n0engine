export class Cell {
    constructor(value) {
      if (value instanceof Array) {
        this.options = value;
        this.option = null
      } else {
        this.options = [];
        for (let i = 0; i < value; i++) {
          this.options[i] = i;
        }
      }
    }


    
  }
  