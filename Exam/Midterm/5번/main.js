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
    }

    drawHeart() {
        ctx.save();
        ctx.translate(this.x, this.y); // 캔버스의 중앙으로 이동
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
}

class StarObject {
    constructor(canvasWidth, canvasHeight, size) {
        this.size = size;
        this.x = Math.random() * (canvasWidth - this.size);
        this.y = Math.random() * (canvasHeight - this.size);
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
        const dx = centerX - this.x; // 캔버스 중심으로 수정
        const dy = centerY - this.y; // 캔버스 중심으로 수정
        const distance = Math.sqrt(dx * dx + dy * dy);
        const xSpeed = dx / distance * this.speed;
        const ySpeed = dy / distance * this.speed;
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

const heartRadius = 2; // 하트의 반지름
const heart = new HeartObject(centerX, centerY, heartRadius);
heart.drawHeart();

const starSize = 20; // 별의 크기
const star = new StarObject(canvas.width, canvas.height, starSize);
star.drawStar();

const enemySpawnInterval = 1000; // 1초마다 적 생성

function spawnEnemies() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > enemySpawnInterval) {
        const enemyCount = Math.floor(Math.random() * 11) + 5; // 5~15 사이의 랜덤한 수
        for (let i = 0; i < enemyCount; i++) {
            // 적의 생성 위치를 녹색 영역 내의 랜덤한 위치로 설정
            const spawnX = Math.random() * (canvas.width - 2 * heartRadius - 1040) + heartRadius + 540;
            const spawnY = Math.random() * (canvas.height - 2 * heartRadius - 1400) + heartRadius + 700;
            const radius = 4;
            const speed = 1;
            const color = getRandomColor();
            const enemy = new Enemy(spawnX, spawnY, radius, speed, color);
            enemies.push(enemy);
        }
        lastSpawnTime = currentTime;
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    heart.drawHeart();
    spawnEnemies();
    enemies.forEach(enemy => {
        enemy.update();
    });
}

animate();
