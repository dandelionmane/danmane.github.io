# EvolutionSimulator
![image](https://cloud.githubusercontent.com/assets/1400023/4349290/9244c4fa-41b0-11e4-8bbc-a3b4bcf0fa7f.png)
This is a Coffeescript / Processing.js project to simulate evolution of bacteria-like organisms in the browser.
[See it live and play with it!](http://danmane.github.io/EvolutionSimulator/)

This is a rather old project but hopefully it still works :) The build script will,
well, build the project, although it depends on the fish shell. :o

### Rules of the Game
Each "blob" has an amount of energy, which is proportional to its size. If its energy goes below zero it dies. It can reproduce, which takes time and energy.
Each "blob" has three attributes: photosynthesis, attack, and fecundity. These correspond to the three primary colors: green, red, and blue. For each blob, you can see which attributes it has based on its color.
 - High photosynthesis leads to more energy generation
 - High attack means the blob can steal energy from its neighbors
 - High fecundity means the blob can reproduce quickly
The attributes are controlled by genes. A blob's genes mutate when it reproduces, so the children may have a slightly different genome (and slightly different colors) from its parents.
Additionally, each blob has a primitive AI which determines when it will try to move, and when it will reproduce. The AI is implemented as a single-layer neural net and the genes control the weights in the net.

### Implementation Details
The frontend and backend are disconnected; the backend runs in a Javascript Web Worker. As a consequence, even as the number of blobs increases exponentially, the simulation slows down but the frontend maintains a consistent framerate. This was inspired by [time dilation from EVE Online](https://wiki.eveonline.com/en/wiki/Time_Dilation).

The blobs' positions are maintained in a QuadTree. Collision detection and resolution is expensive, since there are potentially `N^2` collisions (if all of the blobs overlap at a single point).
