var a = 5;
console.log(a)


function rotate(x2, y2, degrees) {
  // Convert degrees to radians
  var radians = degrees * (Math.PI / 180);

  // Calculate the distance from the center
  var differenceFromCentre = {
    x: x2 - this.x,
    y: y2 - this.y
  };

  // Calculate the new point after rotation
  var newX = this.x + Math.cos(radians) * differenceFromCentre.x - Math.sin(radians) * differenceFromCentre.y;
  var newY = this.y + Math.sin(radians) * differenceFromCentre.x + Math.cos(radians) * differenceFromCentre.y;
  return { x: newX, y: newY };
}