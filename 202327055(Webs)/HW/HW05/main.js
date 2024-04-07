var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");

var sunRotation = 0; // 태양의 회전 각도
var earthRotation = 0; // 지구의 회전 각도
var moonRotation = 0; // 달의 회전 각도

function draw() {
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 태양 그리기
    ctx.save();
    ctx.fillStyle = "orange";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(sunRotation); // 태양의 회전
    ctx.fillRect(-25, -25, 50, 50); // 사각형으로 표현된 태양
    ctx.restore();

    // 지구 그리기
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-sunRotation / 2); // 태양을 중심으로 공전
    ctx.rotate(earthRotation); // 지구의 회전
    ctx.translate(150, 0); // 지구와 태양 사이의 거리
    ctx.fillRect(-15, -15, 30, 30); // 사각형으로 표현된 지구
    ctx.restore();

    // 달 그리기
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.translate(canvas.width / 2, canvas.height / 2); // 캔버스 중심으로 이동
    ctx.rotate(-sunRotation / 2); // 태양을 중심으로 공전
    ctx.rotate(earthRotation); // 지구의 회전
    ctx.translate(150, 0); // 지구와 태양 사이의 거리
    ctx.rotate(moonRotation); // 달의 회전
    ctx.translate(50, 0); // 달과 지구 사이의 거리
    ctx.fillRect(-5, -5, 10, 10); // 사각형으로 표현된 달
    ctx.restore();

    // 회전 각도 증가
    sunRotation += Math.PI / 100; // 태양은 중심으로 자전 (PI/100)
    earthRotation += Math.PI / 150; // 지구는 지구 중심을 기준으로 자전 (PI/150)
    moonRotation += Math.PI / 80; // 달은 달 중심을 중점으로 자전 (PI/80)

    requestAnimationFrame(draw);
}

draw(); // 애니메이션 시작
