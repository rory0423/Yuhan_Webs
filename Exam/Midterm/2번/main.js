const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

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

const heartRadius = 2; // 하트의 반지름
const heart = new HeartObject(centerX, centerY, heartRadius);
heart.drawHeart();

const starSize = 20; // 별의 크기
const star = new StarObject(canvas.width, canvas.height, starSize);
star.drawStar();
