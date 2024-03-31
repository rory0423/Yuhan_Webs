//Canvas Element 불러오기
var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");

// (50,300) (974,300) magenta 3
ctx.beginPath();
ctx.moveTo(50, canvas.height / 2);
ctx.lineTo(canvas.width - 50, canvas.height / 2);
ctx.strokeStyle = "magenta";
ctx.lineWidth = 3;
ctx.stroke();
ctx.closePath();

function drawClock() {
    var studentID = document.getElementById("studentID").value;
    drawNum(studentID);
}

function drawNum(num) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    
    // 시간 형식으로 변환
    var formattedNum = num.substring(0, 4) + ":" + num.substring(4, 6) + ":" + num.substring(6);
    
    ctx.fillText(formattedNum, 20, 50);
}