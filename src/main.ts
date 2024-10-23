const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const canvasSize = 500;
const tile = 50;
const monsterSprite = new Image();
monsterSprite.src = "../../assets/glooRotated.png";
canvas.width = canvasSize;
canvas.height = canvasSize;
canvas.style.border = "2px solid black";
type MapInfo = { start: { x: number; y: number }; end: { x: number; y: number }; totalTiles: number };
let last = 0;

const map: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 0, 2, 2, 2, 3],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 0, 0, 2, 2, 2, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

const mapInfo: MapInfo = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, totalTiles: 0 };

(function () {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 1) mapInfo.start = { x: col, y: row };
      if (map[row][col] === 3) mapInfo.end = { x: col, y: row };
      if (map[row][col] !== 0) mapInfo.totalTiles += 1;
    }
  }
})();

const sprite = {
  face: { id: 0, firstDelay: 2000, secondDelay: 100 },
  time: 0,
  position: { ...mapInfo.start },
  speed: 0.1,
  path: [] as any,
  targetIndex: 0,
};

function BFS() {
  const queue = [sprite.position];
  const visited = new Set();
  const parent: Record<string, any | undefined> = {};
  visited.add(`${sprite.position.x},${sprite.position.y}`);
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
  ];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === mapInfo.end.x && current.y === mapInfo.end.y) {
      let node = current;
      while (node) {
        sprite.path.push(node);
        node = parent[`${node.x},${node.y}`];
      }
      sprite.path.reverse();
      return;
    }
    for (const { dx, dy } of directions) {
      const newX = current.x + dx;
      const newY = current.y + dy;
      if (newX >= 0 && newY >= 0 && newX < map[0].length && newY < map.length && map[newY][newX] !== 0 && !visited.has(`${newX},${newY}`)) {
        visited.add(`${newX},${newY}`);
        parent[`${newX},${newY}`] = current;
        queue.push({ x: newX, y: newY });
      }
    }
  }
}

BFS();

function moveSprite(deltaTime: number) {
  if (sprite.targetIndex < sprite.path.length) {
    const target = sprite.path[sprite.targetIndex];
    const dx = target.x - sprite.position.x;
    const dy = target.y - sprite.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > sprite.speed) {
      sprite.position.x += (dx / distance) * sprite.speed;
      sprite.position.y += (dy / distance) * sprite.speed;
    } else {
      sprite.position = { ...target };
      sprite.targetIndex++;
    }
  }
}

function animateSprite(deltaTime: number) {
  sprite.time += deltaTime;
  if (sprite.face.id === 0 && sprite.time >= sprite.face.firstDelay) {
    sprite.face.id = 1;
    sprite.time = 0;
  } else if (sprite.face.id === 1 && sprite.time >= sprite.face.secondDelay) {
    sprite.face.id = 0;
    sprite.time = 0;
  }
  const spriteX = sprite.face.id * 32;
  ctx.drawImage(monsterSprite, spriteX, 0, 32, 32, sprite.position.x * tile, sprite.position.y * tile, tile, tile);
}

function drawMap() {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      ctx.fillStyle = map[row][col] !== 0 ? "gray" : "green";
      ctx.fillRect(col * tile, row * tile, tile, tile);
      ctx.strokeRect(col * tile, row * tile, tile, tile);
      ctx.font = "20px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(col === 0 ? String(col + row) : String(col), col * tile + 20, row * tile + 35);
    }
  }
}

function draw(deltaTime: number) {
  drawMap();
  animateSprite(deltaTime);
  moveSprite(deltaTime);
}

function update(deltaTime: number) {}

function step(timestamp: number) {
  const deltaTime = timestamp - last;
  last = timestamp;
  update(deltaTime);
  draw(deltaTime);
  requestAnimationFrame(step);
}

requestAnimationFrame(step);
