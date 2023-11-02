class Bone {
    constructor(name, length, rotation, parent) {
        this.name = name;
        this.length = length;
        this.rotation = rotation;
        this.parent = parent;
    }
    getBone(x1, y1) {
        let radians = (Math.PI / 180) * this.rotation;
        let x2 = x1 + Math.cos(radians) * this.length;
        let y2 = y1 + Math.sin(radians) * this.length;
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }
}

export class Poser {
    constructor() {
        this.root = new Bone('root', 0, 0, 10, 0, null);
        this.pelvis = new Bone('pelvis', 0, 0, 10, 0, this.root);
        this.leftLeg = new Bone('leftLeg', 0, 0, 20, 0, this.pelvis);
        this.rightLeg = new Bone('rightLeg', 0, 0, 20, 0, this.pelvis);
        this.leftFoot = new Bone('leftFoot', 0, 0, 10, 0, this.leftLeg);
        this.rightFoot = new Bone('rightFoot', 0, 0, 10, 0, this.rightLeg);
    }
    draw() {

    }
}

