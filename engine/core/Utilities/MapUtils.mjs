Map.prototype.getSet = function(key, defaultValue) {
    let item = this.get(key);
    if (item === undefined) {
        item = defaultValue;
        this.set(key, item);
    }
    return item;
  }
  