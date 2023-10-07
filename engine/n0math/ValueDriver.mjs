export class ValueDriver {
    constructor(value) {
      this.value = value||0;
    }
  
    getValue(x,y) {
        
        if (typeof this.value === 'number') {
        return this.value;
      } else if (this.value.getValue) {
        return this.value.getValue(x,y);
      } else if (Array.isArray(value)) {
        var sum = 0;
        this.value.forEach(v => {
            if (typeof v === 'number') {
                sum+= v;
              } else if (this.value.getValue) {
                sum+= this.value.getValue(x,y);
              }
        });
        return sum;
      } else {
        return 0;
      }
    }
    init(a,b,c) {
        if(this.value.init) {
            this.value.init(a,b,c)
        }
    }
  }
  