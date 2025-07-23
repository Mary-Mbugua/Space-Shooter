// Game variables
let scene, camera, renderer;
let player, bullets = [], enemies = [], particles = [];
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let score = 0;
let lives = 3;
let keys = {};
let lastShot = 0;
let enemySpawnTimer = 0;
let difficulty = 1;

// Game settings
const PLAYER_SPEED = 1;
const BULLET_SPEED = 1;
const ENEMY_SPEED = 1;
const SHOOT_COOLDOWN = 150; // milliseconds
const ENEMY_SPAWN_RATE = 1000; // milliseconds

// Initialize the game
function init() {
    console.log('Initializing game...');
    
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded!');
        return;
    }
    
    // Create scene
    scene = new THREE.Scene();
    console.log('Scene created');
    
    // Create camera (orthographic for 2D feel)
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2,
        1, 1000
    );
    camera.position.z = 100;
    console.log('Camera created');
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('Game container not found!');
        return;
    }
    gameContainer.appendChild(renderer.domElement);
    console.log('Renderer created and added to DOM');
    
    // Create starfield background
    createStarfield();
    console.log('Starfield created');
    
    // Create player
    createPlayer();
    console.log('Player created');
    
    // Set up event listeners
    setupEventListeners();
    console.log('Event listeners setup');
    
    // Start render loop
    animate();
    console.log('Animation started');
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;     // x
        positions[i + 1] = (Math.random() - 0.5) * 200; // y
        positions[i + 2] = (Math.random() - 0.5) * 200; // z
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createPlayer() {
    // Create player ship geometry (triangle-like shape)
    const geometry = new THREE.ConeGeometry(0.5, 2, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    player = new THREE.Mesh(geometry, material);
    player.position.y = -8;
    player.rotation.z = Math.PI; // Point upward
    scene.add(player);
}

function createBullet(x, y) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(geometry, material);
    bullet.position.set(x, y, 0);
    scene.add(bullet);
    bullets.push(bullet);
}

function createEnemy() {
    const geometry = new THREE.BoxGeometry(1, 1, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    const enemy = new THREE.Mesh(geometry, material);
    
    // Random spawn position at top of screen
    enemy.position.x = (Math.random() - 0.5) * 30;
    enemy.position.y = 12;
    enemy.position.z = 0;
    
    // Add some rotation for visual appeal
    enemy.rotation.x = Math.random() * Math.PI;
    enemy.rotation.y = Math.random() * Math.PI;
    
    scene.add(enemy);
    enemies.push(enemy);
}

function createExplosion(x, y, color = 0xffa500) {
    for (let i = 0; i < 15; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.set(x, y, 0);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0
        );
        particle.life = 1.0;
        particle.decay = 0.02;
        
        scene.add(particle);
        particles.push(particle);
    }
}

function setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
        
        if (event.code === 'Space') {
            event.preventDefault();
            if (gameState === 'playing') {
                shoot();
            }
        }
        
        if (event.code === 'KeyP' && gameState === 'playing') {
            gameState = 'paused';
        } else if (event.code === 'KeyP' && gameState === 'paused') {
            gameState = 'playing';
        }
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function shoot() {
    const now = Date.now();
    if (now - lastShot > SHOOT_COOLDOWN) {
        createBullet(player.position.x, player.position.y + 1);
        lastShot = now;
    }
}

function updatePlayer() {
    if (gameState !== 'playing') return;
    
    // Movement
    if (keys['KeyW'] || keys['ArrowUp']) {
        player.position.y = Math.min(player.position.y + PLAYER_SPEED, 10);
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        player.position.y = Math.max(player.position.y - PLAYER_SPEED, -10);
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.position.x = Math.max(player.position.x - PLAYER_SPEED, -15);
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.position.x = Math.min(player.position.x + PLAYER_SPEED, 15);
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.position.y += BULLET_SPEED;
        
        // Remove bullets that are off screen
        if (bullet.position.y > 15) {
            scene.remove(bullet);
            bullets.splice(i, 1);
        }
    }
}

function updateEnemies() {
    const now = Date.now();
    
    // Spawn new enemies
    if (now - enemySpawnTimer > ENEMY_SPAWN_RATE / difficulty) {
        createEnemy();
        enemySpawnTimer = now;
    }
    
    // Update existing enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.position.y -= ENEMY_SPEED * difficulty;
        
        // Rotate for visual appeal
        enemy.rotation.x += 0.02;
        enemy.rotation.y += 0.01;
        
        // Remove enemies that are off screen (player loses a life)
        if (enemy.position.y < -12) {
            scene.remove(enemy);
            enemies.splice(i, 1);
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.position.add(particle.velocity);
        
        // Update life
        particle.life -= particle.decay;
        particle.material.opacity = particle.life;
        
        // Fade out
        if (particle.life <= 0) {
            scene.remove(particle);
            particles.splice(i, 1);
        }
    }
}

function checkCollisions() {
    // Bullet vs Enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            const distance = bullet.position.distanceTo(enemy.position);
            if (distance < 1) {
                // Collision!
                createExplosion(enemy.position.x, enemy.position.y, 0xff6600);
                
                scene.remove(bullet);
                scene.remove(enemy);
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                
                score += 10;
                updateUI();
                break;
            }
        }
    }
    
    // Player vs Enemy collisions
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const distance = player.position.distanceTo(enemy.position);
        
        if (distance < 1.5) {
            // Player hit!
            createExplosion(player.position.x, player.position.y, 0xff0000);
            
            scene.remove(enemy);
            enemies.splice(i, 1);
            
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

function updateDifficulty() {
    // Increase difficulty every 500 points
    difficulty = 1 + Math.floor(score / 500) * 0.3;
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

function startGame() {
    console.log('Starting game...');
    
    // Check if game is initialized
    if (!scene || !camera || !renderer || !player) {
        console.error('Game not properly initialized!');
        return;
    }
    
    gameState = 'playing';
    score = 0;
    lives = 3;
    difficulty = 1;
    
    // Clear all game objects
    bullets.forEach(bullet => scene.remove(bullet));
    enemies.forEach(enemy => scene.remove(enemy));
    particles.forEach(particle => scene.remove(particle));
    bullets = [];
    enemies = [];
    particles = [];
    
    // Reset player position
    player.position.set(0, -8, 0);
    
    // Hide start screen
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOver');
    if (startScreen) startScreen.style.display = 'none';
    if (gameOverScreen) gameOverScreen.style.display = 'none';
    
    updateUI();
    enemySpawnTimer = Date.now();
    console.log('Game started successfully');
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    startGame();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'playing') {
        updatePlayer();
        updateBullets();
        updateEnemies();
        updateParticles();
        checkCollisions();
        updateDifficulty();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, initializing game...');
    try {
        init();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});

// Make sure startGame and restartGame are globally available
window.startGame = startGame;
window.restartGame = restartGame;
