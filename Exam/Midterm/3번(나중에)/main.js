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

const enemies = [];

const heartRadius = 1.5; // 하트의 반지름
const heart = new HeartObject(centerX, centerY, heartRadius);
heart.drawHeart();

const starSize = 20; // 별의 크기
const star = new StarObject(centerX + 150, centerY - 200, starSize);
star.drawStar();

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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    heart.drawHeart();
    heart.update();
    star.drawStar();
    spawnEnemies();

    enemies.forEach((star) => {
        star.x += keyBuffer.x * 2; // 적의 X 좌표를 버퍼 값에 따라 이동
        star.y += keyBuffer.y * 2; // 적의 Y 좌표를 버퍼 값에 따라 이동
    });
}

animate();