# genetic algorithms
only after 8 years of trying to understand genetic algorithms i finally understand

## what is a genetic algorithm?
a genetic algorithm is a piece of code that learns to be something 
it works by copying and editing parts of its makeup.

the part that confused me all these years is how people always seem to pack a neural network into their algorithms.

genetic algorithms use 3 main parts
selection, replication, and mutation

a simple genetic algorithm is one that works with colors.

take the gene code for red [255,0,0] (r,g,b)

copy it and modify it a little randomly 
r: -15, g: 10, b: 13

the mutated copied gene is [240,10,13]

you can get more from red or tell the new gene to reproduce.

an alternative copied gene from red is [250,18,4]

if you reproduced again and again, 
it's possible for the mutations to accumulate so much that it turns green or blue, even purple.

that's literally the basis of genetic algorithms.

## what is a genetic algorithm? (ran through phind)
Yes, you're correct. Genetic algorithms (GAs) are indeed a type of algorithm that learns to be something by copying and editing parts of its makeup. They work by using three main parts: selection, replication, and mutation.

In a simple genetic algorithm working with colors, you could indeed start with a gene code for a color (like red) and then copy and modify it randomly. For example, if you start with the color code for red (255,0,0) and randomly modify it, you could get a new color code like (240,10,13). This is essentially a mutation.

If you were to repeatedly reproduce this color and mutate it, it's possible that the mutations could accumulate enough to change the color from red to green or blue, or even purple. This is essentially the basis of genetic algorithms.

---

you may now wonder how the tutorials get them to learn games, 
that's through a concept called a neural network, 

## neural networks 
in the most basic form, a neural network is literally 
just nodes and their connections along with what people call weights and biases (strengths and offsets)

the way these mutate is differently, 
1. sometimes a mutation will add or remove a node, 
2. a mutation could make the nodes stronger (more powerful) affects all it's connections 
3. and it could affect the strength of the connections themselves.

what that means is alot like flowing water

if you had a river that is thick on the right and thin on the left, most of the water would choose to go right.
this is the idea of a higher weighted connection. imagine that your nodes are the water. 

as the water hits a spot where connections widen, it will become weaker as the water splits off. 
you could imagine a release valve in a dam that releases water when it gets too high pressure

that release valve is the output node being set off. 


the reason they can learn, is that the whole set of nodes and connections get thrown away if they don't meet expectations.

it's the same idea of how you get fresh quality apples when you throw away all the bad ones (give or take...)


--- 
## neural networks (ran through phind):
Yes, you are correct. The way you described the neural network is quite accurate. 

In the most basic form, a neural network consists of interconnected nodes. These nodes are connected by edges, which have associated weights and biases. The weights represent the strength of the connection between two nodes, while the biases represent the offset of the connection. 

The mutation process in a neural network can indeed result in changes to the nodes and their connections. Here are the three types of mutations you mentioned:

1. **Adding or removing a node**: This can change the overall structure of the network. For example, adding a new node can create new connections, while removing a node can disrupt existing connections.

2. **Making the nodes stronger (more powerful)**: This can be achieved by increasing the weights of the connections between nodes. This can affect all the connections that a node is part of.

3. **Affecting the strength of the connections**: This can be achieved by altering the weights of the connections. This can make some connections stronger and others weaker.

The idea of nodes representing water and connections being like a river is indeed a good analogy. The strength of the connections (weights) can be thought of as the volume of water flowing along the river, while the nodes can be thought of as the water itself. The process of mutation can be thought of as a way to change the flow of water, which can lead to the network finding better solutions to the problem it is trying to solve.

The reason neural networks can learn is that they are part of a larger system, such as a neural network training algorithm, which continually adjusts the weights and biases of the network based on how well it performs on a given task. If the network does not perform well, it is discarded and a new one is created, which starts with different weights and biases. This is similar to the idea of discarding bad apples in your analogy.

## neural networks (what they do not talk about when teaching them)

to train a neural network
new neural networks are generated randomly and then mutated using a genetic algorithm
essentially a brain that does not do what it's supposed to is thrown away
the brains that do work properly are copied and mutated. 

a neural network can run without a genetic algorithm in place, 
its a different concept so it should be thought of as different 


... i'm kinda procrastinating by writing these things but you know what documentation is good lol