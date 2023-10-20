# nano animations
say we have a set of animations for each orthogonal direction
how can we set up and use a set of tiles
how can we animate it most efficiently (not optimized)

lets first start with phind(chatgpt)'s approach

```javascript
//it sets up a set of images
let images = {
    down: [],
    up: [],
    left: [],
    right: []
};
//preloads them
function preload() {
    for (let i = 0; i < 4; i++) {
        images.down[i] = loadImage(`nanoDown${i}.png`);
        images.up[i] = loadImage(`nanoUp${i}.png`);
        images.left[i] = loadImage(`nanoLeft${i}.png`);
        images.right[i] = loadImage(`nanoRight${i}.png`);
    }
}
function draw() {
    background(255);

//then it attempts to choose a direction based on velocity of character
    let direction;
    if (character.velocityY > 0) {
        direction = 'down';
    } else if (character.velocityY < 0) {
        direction = 'up';
    } else if (character.velocityX > 0) {
        direction = 'right';
    } else if (character.velocityX < 0) {
        direction = 'left';
    }
    //after that it chooses an animation from the array
    if (direction) {
        if (millis() - timer > interval) {
            frameIndex++;
            timer = millis();
        }
        if (frameIndex == images[direction].length) {
            frameIndex = 0;
        }
        image(images[direction][frameIndex], character.x, character.y);
    }
}

```

this does suck. it's hard to work with for 1, but it's also super hardcoded.
we can follow my usual design philosophy, and make a manager export for this
first we need a map
> and yes i am writing this code without intelisense. i don't need the guidance for things i've done many times

```javascript
//we make a map to hold animation sets
export let animationSetMap = new Map();
export function addAnimationSet(key, key2, values){
    //an animation set for a specific entity
    var animap = animationSetMap.get(key);
    if (!animap) {
        animap = new Map();
        animationSetMap.set(key, animap);
    }
    //and then the animation set itself
    var animap2 = animap.get(key2);
    if (!animap2) {
        animap2 = values || []
        animap.set(key2, animap2);
    }
    return animap;
} //
export function getAnimation(key, key2, frame) {
    var aset = animationSetMap.get(key);
    if (!aset) {
        console.warn(`there's no animation set for ${key}, ${key2}`)
        return null;
    }
    var aset2 = aset.get(key2)
    if (!aset2) {
        console.warn(`there's no animation set for ${key}, ${key2}`)
        return null;
    }
    return aset2[frame%aset2.length]
}

//a test map for
addAnimationSet("nano", "walkUp", ["a1", "a2"])
getAnimation("nano", "walkUp", 0) //
```