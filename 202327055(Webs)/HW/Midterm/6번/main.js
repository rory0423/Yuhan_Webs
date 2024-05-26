const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let lastSpawnTime = 0; // 적이 마지막으로 생성된 시간

class HeartObject {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 0; // 별의 회전 각도
    }

    drawHeart() {
        ctx.save();
        ctx.translate(this.x, this.y); // 캔버스의 중앙으로 이동
        ctx.rotate(this.angle); // 하트를 회전
        ctx.fillStyle = "#FF0000"; // 빨간색 HEX 코드
        ctx.strokeStyle = "black"; // 검은색 테두리
        ctx.lineWidth = 2; // 테두리 두께
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        for (var i = 0; i < 360; i++) {
            var x = this.radius * (16 * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i));
            var y = -this.radius * (13 * Math.cos(Math.PI / 180 * i) - 5 * Math.cos(2 * Math.PI / 180 * i) - 2 * Math.cos(3 * Math.PI / 180 * i) - Math.cos(4 * Math.PI / 180 * i));
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke(); // 테두리 그리기
        ctx.restore();
    }
    update() {
        this.angle += 0.02; // 회전 각도를 증가시켜 별을 회전시킴
    }
}

class StarObject {
    constructor(x, y, size) {
        this.size = size;
        this.x = x;
        this.y = y;
    }

    drawStar() {
        ctx.save();
        ctx.translate(this.x, this.y); // 캔버스의 중앙으로 이동
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black"; // 검은색 테두리
        ctx.lineWidth = 2; // 테두리 두께
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        for (let i = 0; i < 5; i++) {
            ctx.rotate((Math.PI / 180) * 36);
            ctx.lineTo(0, -this.size * 0.5);
            ctx.rotate((Math.PI / 180) * 36);
            ctx.lineTo(0, -this.size);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke(); // 테두리 그리기
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, radius, speed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // 적은 중앙의 플레이어를 향해 움직임
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const xSpeed = (dx / distance) * this.speed;
        const ySpeed = (dy / distance) * this.speed;
        this.x += xSpeed;
        this.y += ySpeed;
        this.draw();
    }
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const enemies = [];

const heartRadius = 1.5; // 하트의 반지름
const heart = new HeartObject(centerX, centerY, heartRadius);
heart.drawHeart();

const starSize = 20; // 별의 크기
const star = new StarObject(centerX + 150, centerY - 200, starSize);
star.drawStar();

const enemySpawnInterval = 1000; // 1초마다 적 생성

function spawnEnemie(minX, maxX, minY, maxY)
{
    const spawnX = Math.random() * (maxX - minX) + minX;
    const spawnY = Math.random() * (maxY - minY) + minY;
    const radius = 4;
    const speed = 0.5;
    const color = getRandomColor();
    const enemy = new Enemy(spawnX, spawnY, radius, speed, color);
    enemies.push(enemy);
}

function spawnEnemies() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > enemySpawnInterval) {
        const enemyCount = Math.floor(Math.random() * 11) + 5; // 5~15 사이의 랜덤한 수
        for (let i = 0; i < enemyCount; i++) {
            spawnEnemie(canvas.width + 480, canvas.width - 500, canvas.height - 600, canvas.height - 650);
            spawnEnemie(canvas.width + 480, canvas.width - 500, canvas.height + 600, canvas.height + 650);
            spawnEnemie(canvas.width + 480, canvas.width + 500, canvas.height + 650, canvas.height - 650);
            spawnEnemie(canvas.width - 480, canvas.width - 500, canvas.height + 650, canvas.height - 650);
        }
        lastSpawnTime = currentTime;
    }
}

function checkCollision(heart, enemy) {
    const dx = heart.x - enemy.x;
    const dy = heart.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < heart.radius + enemy.radius;
}

let isGameOver = false;
let playerLives = 3;

let keyBuffer = { x: 0, y: 0 }; // 방향키 입력 버퍼

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            keyBuffer.y = 0.5;
            break;
        case 'ArrowDown':
            keyBuffer.y = -0.5;
            break;
        case 'ArrowLeft':
            keyBuffer.x = 0.5;
            break;
        case 'ArrowRight':
            keyBuffer.x = -0.5;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            keyBuffer.y = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            keyBuffer.x = 0;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function gameOver()
{
    window.location.href = '../7번/main.html';
}

function animate() {
    if (isGameOver) return;

    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    heart.drawHeart();
    heart.update();
    star.drawStar();
    spawnEnemies();

    enemies.forEach((enemy, index) => {
        enemy.x += keyBuffer.x * 2; // 적의 X 좌표를 버퍼 값에 따라 이동
        enemy.y += keyBuffer.y * 2; // 적의 Y 좌표를 버퍼 값에 따라 이동
        enemy.update();
        if (checkCollision(heart, enemy)) {
            enemies.splice(index, 1); // 충돌 시 적 제거
            playerLives--; // 플레이어 생명 감소
            if (playerLives <= 0) {
                isGameOver = true;
                gameOver();
            }
        }
    });
}

animate();