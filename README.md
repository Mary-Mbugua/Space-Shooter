# Space Shooter 2D - Three.js Game

A fully functional 2D space shooter game built with Three.js featuring smooth gameplay, particle effects, and progressive difficulty.

## Features

- **Player Movement**: WASD or Arrow Keys to move your spaceship
- **Shooting Mechanics**: Spacebar to shoot bullets with cooldown system
- **Enemy AI**: Enemies spawn from the top and move toward the player
- **Collision Detection**: Precise collision detection between bullets, enemies, and player
- **Particle Effects**: Explosion effects when enemies are destroyed or player is hit
- **Progressive Difficulty**: Game gets harder as your score increases
- **Lives System**: Player starts with 3 lives
- **Score System**: Earn 10 points for each enemy destroyed
- **Pause Function**: Press 'P' to pause/unpause the game
- **Responsive Design**: Game adapts to different screen sizes
- **Starfield Background**: Animated star field for immersive space feel

## Game Controls

- **Movement**: WASD or Arrow Keys
- **Shoot**: Spacebar
- **Pause/Unpause**: P key
- **Start Game**: Click "START GAME" button
- **Restart**: Click "PLAY AGAIN" after game over

## How to Play

1. Open `index.html` in a modern web browser
2. Click "START GAME" to begin
3. Use WASD or Arrow Keys to move your green triangular spaceship
4. Press Spacebar to shoot yellow bullets at red enemy cubes
5. Avoid letting enemies reach the bottom of the screen or collide with your ship
6. Survive as long as possible and achieve the highest score!

## Game Mechanics

- **Lives**: You start with 3 lives. Lose a life when:
  - An enemy collides with your ship
  - An enemy reaches the bottom of the screen
- **Scoring**: Earn 10 points for each enemy destroyed
- **Difficulty**: Every 500 points, enemies spawn faster and move quicker
- **Shooting**: Bullets have a cooldown to prevent spam-clicking

## Technical Details

- Built with Three.js (WebGL renderer)
- Uses orthographic camera for 2D gameplay feel
- Efficient object pooling for bullets, enemies, and particles
- 60 FPS smooth animation loop
- Responsive canvas that adapts to window resize

## Browser Compatibility

This game works in all modern browsers that support WebGL:
- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+

## Running the Game

Simply open `index.html` in your web browser. No server setup required - the game runs entirely client-side!

## Game Objects

- **Player Ship**: Green triangular spaceship (you)
- **Bullets**: Yellow spheres fired by the player
- **Enemies**: Red rotating cubes that spawn from the top
- **Particles**: Orange/red explosion effects
- **Stars**: White particle background for atmosphere

Enjoy defending Earth from the alien invasion! 🚀👾