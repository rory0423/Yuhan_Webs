const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

class HexagonObject {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0; // 회전 각도 초기화
        this.rotationSpeed = 1; // 회전 속도
    }

    update() {
        // 회전 각도 업데이트
        this.angle += this.rotationSpeed;
    }

    drawHexagon() {
        ctx.save();
        ctx.translate(this.x, this.y); // 캔버스의 중앙으로 이동
        ctx.rotate(this.angle * Math.PI / 180); // 회전 적용
        ctx.fillStyle = "blue"; // 색상 지정
        ctx.strokeStyle = "black"; // 테두리 색상 지정
        ctx.lineWidth = 1; // 테두리 두께

        ctx.beginPath();
        ctx.moveTo(this.size * Math.cos(0), this.size * Math.sin(0)); // 시작점 이동

        // 6개의 꼭지점을 계산하여 경로 만들기
        for (let i = 1; i <= 6; i++) {
            ctx.lineTo(this.size * Math.cos(i * Math.PI / 3), this.size * Math.sin(i * Math.PI / 3));
        }

        ctx.closePath(); // 경로 닫기
        ctx.fill(); // 색상 채우기
        ctx.stroke(); // 테두리 그리기
        ctx.restore();
    }
}

const hexagonSize = 20; // 6각형의 한 변의 길이
const hexagon = new HexagonObject(centerX, centerY, hexagonSize);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
    hexagon.update(); // 회전 각도 업데이트
    hexagon.drawHexagon(); // 6각형 그리기
    requestAnimationFrame(draw); // 다음 프레임 요청
}

draw(); // 애니메이션 시작