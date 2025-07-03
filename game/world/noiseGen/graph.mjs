
import { createCubicInterpolator, cubicBlendW, inverseLerp, lerp, recubic } from "../../../engine/n0math/ranges.mjs";

export class Graph {
    input(fn, min=-1, max=1) {
        let inp = function (output) {
            output.fn = fn;
            output.min = min;
            output.max = max;
            output.sum = fn(output.x, output.y)
        }
        this.sequence.push(inp);
        return this;
    }
    amp(amplitude=1) {
        if (amplitude instanceof Graph) {
            let ampa = function (output) {
                let tech = amplitude.create(output.x, output.y)
                output.sum *= tech.sum;
                output.minm *= tech.maxm;
                output.maxm *= tech.maxm;
            }
            this.sequence.push(ampa);
        } else {
            let ampa =  function (output) {
                output.sum *= amplitude;
                output.minm *= amplitude;
                output.maxm *= amplitude;
            }
            this.sequence.push(ampa);
        }
        return this;
    }
    offsetX(x=0) {
        if (typeof x === "function") {
            this.sequence.push(function (output) {
                output.x += x(output);
            })
        } else
        if (x instanceof Graph) {
            this.sequence.push(function (output) {
                let tech = x.create(output.x, output.y);
                output.x += tech.sum;
            })
        } else {
            this.sequence.push(function (output) {
                output.x += x;
            })
        }
        return this;
    }
    offsetY(x=0) {
        if (typeof x === "function") {
            this.sequence.push(function (output) {
                output.y += x(output);
            })
        } else
        if (x instanceof Graph) {
            this.sequence.push(function (output) {
                let tech = x.create(output.x, output.y);
                output.y += tech.sum;
            })
        } else {
            this.sequence.push(function (output) {
                output.y += x;
            })
        }
        return this;
    }
    offsetXY(x=0, y=0) {
        this.offsetX(x).offsetY(y);
        return this;
    }
    polar() {
        this.sequence.push(function(output) {
            let ox = output.x, oy = output.y;
            output.x = Math.sqrt(ox * ox + oy * oy);
            output.y = Math.atan2(oy, ox);
        })
        return this;
    }
    fn (a) {
        this.sequence.push(function(output) {
            a?.(output)
        })
    }
    cartesian() {
        this.sequence.push(function(output) {
            let ox = output.x, oy = output.y;
            output.x = ox * Math.cos(oy);
            output.y = ox * Math.sin(oy);
        })
        return this;
    }
    offset(offset=1) {
        let ampa =  function (output) {
            output.sum += offset;
            output.minm += offset;
            output.maxm += offset;
        }
        this.sequence.push(ampa);
        return this;
     }
     abs () {
        this.sequence.push(function (output) {
            output.sum = Math.abs(output.sum);
            output.minm = 0;
        })
        return this;
     }
     pow(p) {
        if (typeof p === "function") {
            this.sequence.push(function (output) {
                let tech= p(output);
                output.sum = spow(output.sum, tech);
           output.minm = spow(output.minm, tech);
           output.maxm = spow(output.maxm, tech);
            })
        } else
        if (p instanceof Graph) {
            this.sequence.push(function (output) {
                let tech = p.create(output.x, output.y);
                
                if (output.sum > output.maxm) output.sum = output.maxm;
                if (output.sum < output.minm) output.sum = output.minm;
                output.minm = spow(output.minm, tech.sum);
                output.maxm = spow(output.maxm, tech.sum);
                output.sum = spow(output.sum, tech.sum);
                
                })
        } else {
        this.sequence.push(function (output) {
           output.sum = spow(output.sum, p);
           output.minm = spow(output.minm, p);
           output.maxm = spow(output.maxm, p);
        })
        } 
        return this;
        function spow(sum, p) {
            let sign = Math.sign(sum)
            let abs = Math.abs(sum)
            let pow = Math.pow(abs, p)
            return pow*sign
        }
     }
     sqrt () {
        this.sequence.push(function(output) {
            output.sum = Math.sqrt(output.sum)
        })
    }
     add(v) {
        if (typeof v === "function") {
            this.sequence.push(function(output){
                let tech = v(output);
                output.sum += tech;
                output.minm += tech;
                output.maxm += tech;
            })
        } else 
        if (v instanceof Graph) {
            this.sequence.push(function(output) {
                let tech = v.create(output.x, output.y);
                output.sum += tech.sum;
                output.minm += tech.minm;
                output.maxm += tech.maxm;
            })
        } else {
        this.sequence.push(function (output) {
            output.sum += v;
            output.minm += v;
            output.maxm += v;
        })
        }
        return this;
     }
     multiply(v) {
        if (typeof v === "function") {
            this.sequence.push(function(output){
                let tech = v(output);
                output.sum *= tech;
                output.minm *= Math.abs(tech);
                output.maxm *= Math.abs(tech);
            })
        } else 
        if (v instanceof Graph) {
            this.sequence.push(function(output){
                let tech = v.create(output.x, output.y);
                output.sum *= tech.sum;
                output.minm *= Math.abs(tech.sum);
                output.maxm *= Math.abs(tech.sum);
            })
        } else {
        this.sequence.push(function (output) {
            output.sum *= v;
            output.minm *= v;
            output.maxm *= v;
        })
        }
        return this;
     }

     newBlend(points, pow=1) {
        this.sequence.push(function (output) {
            let i = inverseLerp(output.minm, output.maxm, output.sum);
            var { sums, nvu } = blendSumMinMax(points, i, pow, output.x, output.y);
            output.sum = nvu;
            let [min, max] = sums.reduce(([prevMin, prevMax], curr) => [Math.min(prevMin, curr), Math.max(prevMax, curr)], [Infinity, -Infinity]);
            output.minm = min;// lerp(output.minm, min, blendWeight);
            output.maxm = max;//lerp(output.maxm, max, blendWeight);    
        })
        return this;
        //cubic blend the mins and maxes too
        function blendSumMinMax(points, i, blendPower,x,y) {
            let spoints = points.map(v => {
                if (typeof v === "function") return v(x,y);
                if (v instanceof Graph) return v.create(x,y);
                return v
            })
            var sums = spoints.map(v => {
                
                        if (v.sum != null) 
                            return v.sum;
                        return v;
                    });
                    /*
                    var mins = spoints.map(v => {
                        if (v.minm != null) 
                            return v.minm;
                        return v;
                    });
                    var maxes = spoints.map(v => {
                        if (v.maxm != null) 
                            return v.maxm;
                        return v;
                    });
                    */
                    var nvu = cubicBlendW(sums, i, blendPower);
                    //var min = cubicBlendW(mins, i, blendPower);            
                    //var max = cubicBlendW(maxes, i, blendPower);
                    // sums.push(min);
                    // sums.push(max);
                    //console.log({sums, nvu, mins, min, maxes, max})
                    return { sums, nvu };
        }
    }
     bicubic(points, power = 2, weight) {
        this.sequence.push((output)=> { 
            let i = inverseLerp(output.minm, output.maxm, output.sum);
            let sums = points.map((v)=>{
                if (typeof v === "function") return v(output);
                if (v instanceof Graph) {
                    let tech = v.create(output.x, output.y);
                    return tech.sum;
                } 
                if (v.sum != null) return v.sum;
                return v;
            })
            output.sum = lerp(output.minm, output.maxm,  recubic(sums, i, power));
         })
         return this;
     }

     map(points, min,max) {
        
        this.sequence.push((output)=>{
            let poi = points.map(p=>{
                let y = p.y;
                if (typeof y === "function") y = y(output);
                else if (y instanceof Graph) y = y.create(x,y).sum;
                return { "c": p.c, "y": y, "p": p.p }
            })
        let mapper = createCubicInterpolator(poi);
        var sim = inverseLerp(output.minm, output.maxm, output.sum); //shift into 0 to 1 space
        output.sum = lerp (output.minm, output.maxm, mapper(sim));
        //minmax.minm = min
        //minmax.maxm = max
        })
        return this;
     }
     invert() {
        this.sequence.push(function (output) {
            let i = inverseLerp(output.minm, output.maxm, output.sum);
            output.sum = lerp(output.maxm, output.minm, i);
        })
        return this;
     }
     lowClip(low) {
        this.sequence.push(function (output) {
            if (output.sum < low) output.sum = low;
            if (output.minm < low) output.minm = low;
        })
        return this;
     }
     highClip(high) {
        this.sequence.push(function (output) {
            if (output.sum > high) output.sum = high;
            if (output.maxm > high) output.maxm = high;
        })
        return this;
     }
     clamp(low=-1, high=1) {
        this.lowClip(low).highClip(high);
        return this;
     }
     saturate() {
        this.lowClip(0).highClip(1);
        return this;
     }
     threshold(value) {
        if (typeof value === "function") {
            this.sequence.push(function (output) {
                let tech = value(output);
                output.sum = output.sum >= tech ? 1 : 0;
                output.minm = 0; output.maxm = 1;                
            })
        } else
        if (value instanceof Graph) {
            let ampa = function (output) {
                let tech = value.create(output.x, output.y)
                output.sum = output.sum >= tech.sum ? 1 : 0;
                output.minm = 0; output.maxm = 1;
            }
            this.sequence.push(ampa);
        }
        else {
        this.sequence.push(function (output) {
            output.sum = output.sum >= value ? 1 : 0;
            output.minm = 0; output.maxm = 1;
        })
        }
        return this;
    }

    posterize(steps) {
        this.sequence.push(function(output) {
            if ((steps-1) <= 0) {
                output.sum = 0;
                return 
            }
            let sum = output.sum * (steps-1);
            sum = Math.round(sum)
            output.sum = sum / (steps-1);
        })
        return this;
    }
    floor () {
        this.sequence.push(function(output) {
            output.sum = Math.floor(output.sum)
        })
        return this;
    }
    ceil () {
        this.sequence.push(function(output) {
            output.sum = Math.ceil(output.sum)
        })
        return this;
    }
    scaleX(value) {
        if (typeof value === "function") {
            this.sequence.push(function (output) {
                let tech = value(output);
                output.x /= tech;
                output.scaleX /= tech;
            })
        } else
        if (value instanceof Graph) {
            let ampa = function (output) {
                let tech = value.create(output.x, output.y)
                output.x /= tech.sum;
                output.scaleX /= tech.sum;
            }
            this.sequence.push(ampa);
        }
        else {
        this.sequence.push(function (output) {
            output.x /= value
            output.scaleX /= value;
        })
        }
        return this;
    }
    scaleY(value) {
        if (typeof value === "function") {
            this.sequence.push(function (output) {
                let tech = value(output);
                output.y /= tech;
                output.scaleY /= tech;
            })
        } else
        if (value instanceof Graph) {
            let ampa = function (output) {
                let tech = value.create(output.x, output.y)
                output.y /= tech.sum;
                output.scaleY /= tech.sum;
            }
            this.sequence.push(ampa);
        }
        else {
        this.sequence.push(function (output) {
            output.y /= value
            output.scaleY /= value;
        })
        }
        return this;
    }
    scaleXY(value, value2) {
        value2 ??= value;
        this.scaleX(value)
        this.scaleY(value2)
        return this;
    }
    fractal(fn, octaves=1, persistance=.5, lacunarity=1) {
        let inp = function(output) {
            let minm=0, maxm =0
            let amp=1, freq=1, sum =0;
            if (Array.isArray(fn)) {
                octaves = fn.length;  
            }
            for (let o = 0; o < octaves; o++) {
                
                var sx = output.x * freq;
                var sy = output.y * freq;
                let cfn = Array.isArray(fn) ? fn[o] : fn; 
            
                var value = cfn.input(sx, sy);
                sum += value * amp;
                minm += cfn.min * amp;
                maxm += cfn.max * amp;

                amp *= persistance;
                freq *= lacunarity;
            }
            output.sum = output.sum ===undefined ? sum : output.sum + sum;
            output.minm = output.minm ===undefined ? minm : output.minm + minm;
            output.maxm = output.maxm ===undefined ? maxm : output.maxm + maxm;
        }
        this.sequence.push(inp);
        return this;
    } 
    sdf(fn) {
        this.sequence.push(function(output) {
            //console.log(fn)
            let value = fn.input(output.x, output.y);
            if (output.sum === undefined) output.sum = fn.max;
            output.sum = Math.min(output.sum, value);
            //output.minm = fn.min; output.maxm = fn.max;
            output.minm = output.minm ===undefined ? fn.min : output.minm + fn.min;
            output.maxm = output.maxm ===undefined ? fn.max : output.maxm + fn.max;
        });
    }
    anglize () {
        this.sequence.push(function(output) {
            let tau = Math.PI*2;
            output.sum = inverseLerp(output.maxm, output.minm, output.sum) * tau;
            output.minm = 0;
            output.maxm = tau;
        })
        return this;
    }
    sinm () {
        this.sequence.push(function(output) {
            let sum = inverseLerp(output.maxm, output.minm, output.sum) * Math.PI*2;
            output.sum = Math.sin(sum)
            output.minm = -1;
            output.maxm = 1;
        })
        return this;
    }
    sin() {
        this.sequence.push(function(output) {
            output.sum = Math.sin(output.sum)
            output.minm = -1;
            output.maxm = 1
        })
        return this;
    }
    cos() {
        this.sequence.push(function(output) {
            output.sum = Math.cos(output.sum)
            output.minm = -1;
            output.maxm = 1
        })
        return this;
    }
    constructor() {
        this.sequence = [];
    }
    copy(graph) {
        this.sequence.unshift(...(graph.sequence))
        return this;
    }
    import(input) {
        this.sequence.push(function(output){
            Object.assign(output, input)
        })
        return this;
    }
    create(x,y) {
        let output = { x, y, sum:0, minm:0, maxm:0, scale:1 }
        for (const fn of this.sequence) {
            fn(output);
        } 
        return output;
    }
    createIterator(x,y) {
        let o = this, xz=x, xy=y;
        return function* () {
            let output = { x:xz, y:xy }
            console.log({o,xz,xy})
        for (const fn of o.sequence) {
            fn(output);
            yield output
        } 
        return output;
        }
    }
   
}