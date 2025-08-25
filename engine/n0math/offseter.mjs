export class Offseter {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    rotate(x2, y2, degrees) {
      var radians = degrees * (Math.PI/180);

      var newX = (x2 * Math.cos(radians) - y2 * Math.sin(radians));
      var newY = (x2 * Math.sin(radians) + y2 * Math.cos(radians));
      //console.log({x2, y2, thisx: this.x, thisy: this.y, newX, newY})
      return {x: this.x + newX, y: this.y + newY};
    }
    scale(x2, y2, scale) {
      var newX = this.x + (x2 * scale);
      var newY = this.y + (y2 * scale);
  
      return {x: newX, y: newY};
    }
    shift(x2, y2) {
    
        var newX = this.x + x2;
        var newY = this.y + y2;
    
        return {x: newX, y: newY};
      }
      transformPoint(x2, y2, x, y, degrees, scale) {
        // Convert degrees to radians
        var radians = degrees * (Math.PI/180);
    
        // Calculate the distance from the center
        var differenceFromCentre = {
          x: x2 - this.originX,
          y: y2 - this.originY
        };
    
        // Calculate the new point after rotation
        var newX = this.originX + Math.cos(radians) * differenceFromCentre.x - Math.sin(radians) * differenceFromCentre.y;
        var newY = this.originY + Math.sin(radians) * differenceFromCentre.x + Math.cos(radians) * differenceFromCentre.y;
    
        // Calculate the new point after scaling
        var scaledX = this.originX + (newX - this.originX) * scale;
        var scaledY = this.originY + (newY - this.originY) * scale;
    
        return {x: scaledX+x, y: scaledY+y};
      }
  }