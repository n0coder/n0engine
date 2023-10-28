i have a set of input 3x3 template images
each color corresponds to a category, lets say we detect 3 colors, white, blue, black
we will output an array with a color id for each color.

the idea is that we assign the color ids in a 2d map.

an all white square should be [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
black square with a white top 
[[1, 1, 1], [1, 0,0], [0,0,0], [1, 0,0]]
we need the arrays to be assigned in directional position, instead of clockwise

top right white, rest black: [0,0, 1], [1,0,0], [0,0,0], [0,0,0]
the array order is clockwise but the inside arrays are ordered



order from top to bottom in clockwise order

[0,1,2], [0,1,2], [2,1,0], [2,1,0]


