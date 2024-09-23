Game: PacmanPlus
- Language: Use HTML5, JS Canvas

- Algorithm: 
1. Collision Detection
Method: The function circleCollidesWidthRectangle checks for collisions between circles (the player and ghosts) and rectangles (boundaries).
How It Works: It compares the positions of the circle and rectangle to determine if they intersect.
2. Position Update
Method: Each frame, the position of the player and ghosts is updated based on their velocity.
How It Works: Objects move according to user input (key presses) or randomly (for ghosts).
3. Event Handling
Method: The code uses keydown and keyup events to track the state of control keys.
How It Works: When a key is pressed, the corresponding key state is updated, allowing the player to move in the game.
4. Win/Lose Conditions
Method: The game checks for the number of pellets remaining and collisions between the player and ghosts.
How It Works: If the player collects all pellets, they win; if they collide with a ghost while not in a "scared" state, they lose.
5. Timing Management
Method: setTimeout is used to manage the duration of power-ups (like making ghosts scared).
How It Works: The state of ghosts changes after a specified time period.
6. Random Movement
Method: Ghosts move randomly when they encounter obstacles.
How It Works: If a ghost hits a boundary, it chooses one of the available directions to move

-Controls:
Use the arrow keys or W, A, S, D keys to move:
W (or up arrow): Move up.
A (or left arrow): Move left.
S (or down arrow): Move down.
D (or right arrow): Move right.
-Collisions:
If the player collides with a ghost:
If the ghost is not "scared," the player loses, and the game ends.
If the ghost is "scared," the player can defeat the ghost.
-Power-Up: 
When collected, ghosts become "scared" for a limited time (e.g., 5 seconds).
-Invisible:
When collected, ghosts become invisible for a limited time.
-Frozen:
When collected, ghosts are frozen and do not move for a limited time.
-Win: 
The player wins by collecting all the pellets.
=Lose:
The player loses by colliding with a ghost that is not "scared."
-Scoring:
Each pellet collected increases the player's score (e.g., 10 points for each pellet).
  
