const canvas = document.getElementById('myCanvas'); // 캔버스 요소 가져오기
const ctx = canvas.getContext('2d'); // 2D 컨텍스트 가져오기
let angle = 0; // 초기 각도 설정
let color = 'blue'; // 초기 삼각형 색상 설정

const sideLength = 100; // 정삼각형의 한 변의 길이

function drawTriangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지웁니다

    ctx.save(); // 현재 상태 저장
    ctx.translate(canvas.width / 2, canvas.height / 2); // 캔버스의 중심으로 이동
    ctx.rotate(angle * Math.PI / 180); // 캔버스를 회전

    const height = Math.sqrt(3) / 2 * sideLength; // 정삼각형의 높이 계산

    ctx.beginPath();
    ctx.moveTo(0, -height / 2); // 삼각형의 상단 꼭짓점
    ctx.lineTo(-sideLength / 2, height / 2); // 삼각형의 왼쪽 아래 꼭짓점
    ctx.lineTo(sideLength / 2, height / 2); // 삼각형의 오른쪽 아래 꼭짓점
    ctx.closePath();

    ctx.fillStyle = color; // 삼각형 색상 설정
    ctx.fill(); // 삼각형을 채움
    ctx.restore(); // 저장된 상태 복원
}

function animate() {
    angle += 1; // 각도 증가
    drawTriangle(); // 삼각형 그리기
    requestAnimationFrame(animate); // 다음 프레임 요청
}

function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const v0 = [cx - ax, cy - ay];
    const v1 = [bx - ax, by - ay];
    const v2 = [px - ax, py - ay];

    const dot00 = v0[0] * v0[0] + v0[1] * v0[1];
    const dot01 = v0[0] * v1[0] + v0[1] * v1[1];
    const dot02 = v0[0] * v2[0] + v0[1] * v2[1];
    const dot11 = v1[0] * v1[0] + v1[1] * v1[1];
    const dot12 = v2[0] * v1[0] + v2[1] * v1[1];

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0) && (v >= 0) && (u + v < 1);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 삼각형의 꼭짓점 좌표를 회전 후 계산
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const height = Math.sqrt(3) / 2 * sideLength;
    const cos = Math.cos(angle * Math.PI / 180);
    const sin = Math.sin(angle * Math.PI / 180);

    const ax = cx + (0 * cos - (-height / 2) * sin);
    const ay = cy + (0 * sin + (-height / 2) * cos);
    const bx = cx + (-sideLength / 2 * cos - height / 2 * sin);
    const by = cy + (-sideLength / 2 * sin + height / 2 * cos);
    const cx1 = cx + (sideLength / 2 * cos - height / 2 * sin);
    const cy1 = cy + (sideLength / 2 * sin + height / 2 * cos);

    if (isPointInTriangle(x, y, ax, ay, bx, by, cx1, cy1)) {
        color = color === 'red' ? 'blue' : 'red'; // 삼각형 내부 클릭 시 색상 변경
    }
});

animate(); // 애니메이션 시작

