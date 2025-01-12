
class ValueDriver {
  constructor(value, mode = "added") {
    this.value = value || 0;
    this.mode = mode;
  }

  getValue(x, y) {
    if (typeof this.value === 'function') {
        return this.value(x, y)
    }
    if (typeof this.value === 'number') {
      return this.value;
    } else if (this.value.getValue != null) {
      return this.value.getValue(x, y);
    } else if (Array.isArray(value)) {
      var sum = 0;
      this.value.forEach(v => {
        let o = 0;
        if (typeof v === 'number') o = v 
        else if (typeof this.value === 'function') {
          o = this.value(x, y)
        }
        else if (v.getValue) 
          o = v.getValue(x, y);
        if (mode ==="added") 
          sum += o;
        else if (mode === "multiplied")
          sum *= o;        
      });
      return sum;
    } else {
      return 0;
    }
  }
  init(a, b, c) {
    if (this.value.init) {
      this.value.init(a, b, c)
    }
  }
}
