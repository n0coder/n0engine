export function inverseLerp(a, b, t) {
    return (t - a) / (b - a);
  }
export function lerp(a, b, t) {
    return a + (b - a) * t;
  }
export function remap(a, b, a2, b2, t) {
    return ((t - a) / (b - a)) * (b2 - a2) + a2;
  }
  export function clamp(i,o, t) {
    if (t < i) t=i;
    if (t>o) t = o
    return t;
  }
  export function blend(points, t) {
    let n = points.length - 1;
    let result = 0;

    for(let i = 0; i <= n; i++) {
        result += binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i) * points[i];
    }

    return result;
  }
 export function blendw(points, t) {
    // Preprocess the array to handle weighted values
    let processedPoints = [];
    points.forEach(point => {
        if (Array.isArray(point)) {
          for (let i = 0; i < point[1]; i++) {
              processedPoints.push(point[0]);
          }
        }  else {
            processedPoints.push(point);
        }
    });

    // Calculate the Bezier curve as before
    let n = processedPoints.length - 1;
    let result = 0;
    for(let i = 0; i <= n; i++) {
        result += binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i) * processedPoints[i];
    }

    return result;
}

function binomial(n, i) {
    return factorial(n) / (factorial(n - i) * factorial(i));
}

function factorial(n) {
    let result = 1;

    for(let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}
export function createInterpolator(points) {
  points.sort((a, b) => a.c - b.c);
  return function(x) {
      for(let i = 0; i < points.length; i++) {
          if(x === points[i].c) {
              return points[i].y;
          } else if(i < points.length - 1 && x < points[i+1].c) {
              let slope = (points[i+1].y - points[i].y) / (points[i+1].c - points[i].c);
              return points[i].y + slope * (x - points[i].c);
          }
      }
      return null;
  }
}
export function createCubicInterpolator(points) {
  points.sort((a, b) => a.c - b.c);
  return function(x) {
      for(let i = 0; i < points.length - 1; i++) {
          if(x >= points[i].c && x <= points[i+1].c) {
              let t = (x - points[i].c) / (points[i+1].c - points[i].c);
              var ipow =  Math.pow(1 - t,points[i].p?points[i].p:2 )
              var i1pow =  Math.pow(t, points[i+1].p?points[i+1].p:2 );
              let a = points[i].y * (1 + 2*t) * ipow;
              let b = points[i+1].y * (3 - 2*t) *i1pow;
              return a + b;
          }
      }
      return null;
  }
}