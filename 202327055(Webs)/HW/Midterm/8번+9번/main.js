const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let lastSpawnTime = 0; // 적이 마지막으로 생성된 시간
let lastStarSpawnTime = 0; // 별이 마지막으로 생성된 시간

class HeartObject {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 0; // 하트의 회전 각도
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
        for (let i = 0; i < 360; i++) {
            const x = this.radius * (16 * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i));
            const y = -this.radius * (13 * Math.cos(Math.PI / 180 * i) - 5 * Math.cos(2 * Math.PI / 180 * i) - 2 * Math.cos(3 * Math.PI / 180 * i) - Math.cos(4 * Math.PI / 180 * i));
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

const visibleEnemies = []; // 현재 화면에 있는 적들을 저장하는 배열
const invisibleEnemies = []; // 제거된 적들을 임시로 저장하는 더미 배열

const stars = []; // 별을 저장할 배열 추가

const heartRadius = 1.5; // 하트의 반지름
const heart = new HeartObject(centerX, centerY, heartRadius);
heart.drawHeart();

const enemySpawnInterval = 1000; // 1초마다 적 생성
const starSpawnInterval = 15000; // 15초마다 별 생성

function spawnEnemy(minX, maxX, minY, maxY) {
    const spawnX = Math.random() * (maxX - minX) + minX;
    const spawnY = Math.random() * (maxY - minY) + minY;
    const radius = 4;
    const speed = 0.5;
    const color = getRandomColor();
    const enemy = new Enemy(spawnX, spawnY, radius, speed, color);
    visibleEnemies.push(enemy);
}

function RecycleEnemy(minX, maxX, minY, maxY) {
    const enemy = invisibleEnemies.pop();
    const spawnX = Math.random() * (maxX - minX) + minX;
    const spawnY = Math.random() * (maxY - minY) + minY;
    enemy.x = spawnX;
    enemy.y = spawnY;
    visibleEnemies.push(enemy);
}

function spawnEnemies() {
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > enemySpawnInterval) {
        const enemyCount = Math.floor(Math.random() * 11) + 5; // 5~15 사이의 랜덤한 수
        for (let i = 0; i < enemyCount; i++) {
            if (invisibleEnemies.length > 0) {
                RecycleEnemy(canvas.width + 480, canvas.width - 500, canvas.height - 600, canvas.height - 650);
                RecycleEnemy(canvas.width + 480, canvas.width - 500, canvas.height + 600, canvas.height + 650);
                RecycleEnemy(canvas.width + 480, canvas.width + 500, canvas.height + 600, canvas.height - 650);
                RecycleEnemy(canvas.width - 480, canvas.width - 500, canvas.height + 600, canvas.height - 650);
            } else {
                spawnEnemy(canvas.width + 480, canvas.width - 500, canvas.height - 600, canvas.height - 650);
                spawnEnemy(canvas.width + 480, canvas.width - 500, canvas.height + 600, canvas.height + 650);
                spawnEnemy(canvas.width + 480, canvas.width + 500, canvas.height + 600, canvas.height - 650);
                spawnEnemy(canvas.width - 480, canvas.width - 500, canvas.height + 600, canvas.height - 650);
            }
        }
        lastSpawnTime = currentTime;
    }
}

function spawnStar() {
    const currentTime = Date.now();
    if (currentTime - lastStarSpawnTime > starSpawnInterval) {
        const starSize = 20; // 별의 크기
        const minX = starSize; // 최소 X 좌표
        const maxX = canvas.width - starSize; // 최대 X 좌표
        const minY = starSize; // 최소 Y 좌표
        const maxY = canvas.height - starSize; // 최대 Y 좌표
        const spawnX = Math.random() * (maxX - minX) + minX;
        const spawnY = Math.random() * (maxY - minY) + minY;
        const star = new StarObject(spawnX, spawnY, starSize);
        stars.push(star);
        lastStarSpawnTime = currentTime;
    }
}

function spawnStars() {
    setInterval(spawnStar, starSpawnInterval); // 15초마다 별 생성
}

spawnStars(); // 별 생성 함수 호출

function checkCollision(heart, enemy) {
    const dx = heart.x - enemy.x;
    const dy = heart.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < heart.radius + enemy.radius;
}

let isGameOver = false;
let playerLifes = 3;

let keyBuffer = { x: 0, y: 0 }; // 방향키 입력 버퍼

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            keyBuffer.y = 1;
            break;
        case 'ArrowDown':
            keyBuffer.y = -1;
            break;
        case 'ArrowLeft':
            keyBuffer.x = 1;
            break;
        case 'ArrowRight':
            keyBuffer.x = -1;
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

function gameOver() {
    window.location.href = '../7번/main.html';
}

function checkStarCollision(heart, star) {
    const dx = heart.x - star.x;
    const dy = heart.y - star.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < heart.radius + star.size;
}

function drawCircle() {
    const circleRadius = 25; // 원의 반지름
    const centerX = heart.x; // 하트의 x 좌표
    const centerY = heart.y; // 하트의 y 좌표

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2); // 중심 좌표와 반지름 설정
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"; // 채우기 색상 및 투명도 설정
    ctx.fill(); // 채우기
    ctx.closePath();
    ctx.restore();
}

let score = 0;
const scoreX = canvas.width - 200;
const scoreY = 30;

// 별을 먹었을 때 하트가 커지고, 주변 적을 제거하는 함수
function eatStar(star) {
    // 먹기 전에 적의 수를 저장합니다.
    const killedEnemies = visibleEnemies.length;

    let growInterval;
    growInterval = setInterval(() => {
        heart.radius += 0.1; // 하트 크기 증가
        if (heart.radius >= 3) {
            clearInterval(growInterval); // 크기가 일정 수준 이상이면 커지는 것을 멈춤
            // 화면에 보이는 적만 제거하고 보이지 않는 적으로 이동
            visibleEnemies.forEach((enemy) => {
                invisibleEnemies.push(enemy); // 보이지 않는 적으로 이동
            });
            visibleEnemies.length = 0; // 화면에 보이는 적 배열 초기화
            heart.radius = 1.5;
            score += killedEnemies; // 먹은 별로 인해 죽인 적의 수를 점수에 추가
            // 점수를 화면에 표시하기 위해 draw 함수 내부에서 호출합니다.
        }
    }, 50); // 0.05초마다 크기를 증가시킴

    // 먹은 별 제거
    stars.splice(stars.indexOf(star), 1);
}

// 화면에 보이는 적인지 여부를 확인하는 함수
function checkEnemyOnScreen(enemy) {
    return enemy.x >= 0 && enemy.x <= canvas.width && enemy.y >= 0 && enemy.y <= canvas.height;
}

function animate() {
    if (isGameOver) return;

    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    heart.drawHeart();
    heart.update();
    spawnEnemies();

    visibleEnemies.forEach((enemy, index) => {
        enemy.x += keyBuffer.x * 2; // 적의 X 좌표를 버퍼 값에 따라 이동
        enemy.y += keyBuffer.y * 2; // 적의 Y 좌표를 버퍼 값에 따라 이동
        enemy.update();
        if (checkCollision(heart, enemy)) {
            visibleEnemies.splice(index, 1); // 충돌 시 적 제거
            invisibleEnemies.push(enemy); // 제거된 적을 invisibleEnemies 배열로 이동
            playerLifes--; // 플레이어 생명 감소
            if (playerLifes <= 0) {
                //isGameOver = true;
                //gameOver();
            }
        }
    });

    stars.forEach((star) => {
        star.drawStar();
        star.x += keyBuffer.x; // 방향키 입력에 따라 별의 X 좌표 조정
        star.y += keyBuffer.y; // 방향키 입력에 따라 별의 Y 좌표 조정
        if (checkStarCollision(heart, star)) {
            eatStar(star);
        }
    });

    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Score: ' + score, scoreX, scoreY);
}

animate();
