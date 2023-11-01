the easist thought i have right now is to make a pseudo tower defense game, 
we'll have a small town, and a few storage units

the evil nanos will attempt to steal candy from the village
the good nanos will give out candy to the evil nanos

at this stage we'll prototype the mission system, waypoints and a*


a nano is given a set of actions as their job
the evil nanos will have one goal

evilNano.brain.do("harvest", chest, "sugar"); //their goal is to harvest raw sugar items from the chest
goodNano.brain.do("protect", shop, "candy"); //the good nano will protect the chest, by giving their own sugar


this won't work if the good nano runs out of food, 
so we'll need the nanos to work together to supply the good nano with their own sugar


you may be wondering, why prevent the evil nano from taking sugar directly from the shop?

they are likely to take the raw supplies used to make candy, which is more valuable to nanos

candy is worth more than the raw sugar, and we don't want the shop's sugar supply to be destroyed

when an evil nano enters the shop, they may break the containers open, and damage the shop's property, this hurts the business.
so we give them candy to stop their