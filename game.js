// Game Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const TILE_SIZE = 20;
const MAP_WALL = '#';
const MAP_DOT = '.';
const PLAYER_COLOR = '#0F0';

// Game Variables
let canvas, ctx;
let map, playerPosition, dotCount, score;

// Key Codes
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

// Load JSON level data
fetch('level1.json')
  .then(response => response.json())
  .then(data => {
    // Initialize game variables
    map = data.map;
    playerPosition = data.playerStartPosition;
    dotCount = data.dotCount;
    score = 0;

    // Start the game
    initializeGame();
  })
  .catch(error => console.error('Error loading level data:', error));

// Initialize the game
function initializeGame() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');

  document.addEventListener('keydown', handleKeyPress);
  document.getElementById('reset-button').addEventListener('click', resetGame);

  drawMap();
  drawPlayer(playerPosition.x, playerPosition.y);
}

// Draw the game map
function drawMap() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];

      if (tile === MAP_WALL) {
        ctx.fillStyle = '#0F0';
      } else if (tile === MAP_DOT) {
        ctx.fillStyle = '#00FF00';
      } else {
        continue;
      }

      const posX = x * TILE_SIZE;
      const posY = y * TILE_SIZE;

      ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
    }
  }
}

// Draw the player
function drawPlayer(x, y) {
  ctx.fillStyle = PLAYER_COLOR;
  ctx.beginPath();
  ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

// Handle key press events
function handleKeyPress(event) {
  const key = event.keyCode;

  const nextX = playerPosition.x;
  const nextY = playerPosition.y;

  if (key === KEY_UP) {
    playerPosition.y--;
  } else if (key === KEY_DOWN) {
    playerPosition.y++;
  } else if (key === KEY_LEFT) {
    playerPosition.x--;
  } else if (key === KEY_RIGHT) {
    playerPosition.x++;
  }

  if (isMoveValid(nextX, nextY)) {
    drawMap();
    drawPlayer(playerPosition.x, playerPosition.y);
    checkCollision();
  } else {
    playerPosition.x = nextX;
    playerPosition.y = nextY;
  }
}

// Check if the player collides with a dot
function checkCollision() {
  if (map[playerPosition.y][playerPosition.x] === MAP_DOT) {
    map[playerPosition.y] = map[playerPosition.y].substr(0, playerPosition.x) + ' ' + map[playerPosition.y].substr(playerPosition.x + 1);
    score++;
    dotCount--;

    if (dotCount === 0) {
      alert('Congratulations! You cleared all the dots!');
      resetGame();
    }
  }

  document.getElementById('score').textContent = score;
}

// Check if the player's move is valid
function isMoveValid(x, y) {
  const tile = map[y][x];

  return tile !== MAP_WALL;
}

// Reset the game
function resetGame() {
  drawMap();
  drawPlayer(playerPosition.x, playerPosition.y);
  dotCount = 32;
  score = 0;
  document.getElementById('score').textContent = score;
}
