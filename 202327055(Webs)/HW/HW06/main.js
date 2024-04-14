var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");
var hearts = [];

class HeartObject {
    constructor(x, y) {
        this.color = getRandomColor();
        this.radius = getRandomNumber(1, 3);
        this.positionX = x;
        this.positionY = y;
        this.speedX = getRandomNumber(-2, 2);
        this.speedY = getRandomNumber(-2, 2);
        this.rotationSpeed = getRandomNumber(-2, 2);
        this.rotation = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        for (var i = 0; i < 360; i++) {
            var x = this.radius * (16 * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i) * Math.sin(Math.PI / 180 * i));
            var y = -this.radius * (13 * Math.cos(Math.PI / 180 * i) - 5 * Math.cos(2 * Math.PI / 180 * i) - 2 * Math.cos(3 * Math.PI / 180 * i) - Math.cos(4 * Math.PI / 180 * i));
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.positionX += this.speedX;
        this.positionY += this.speedY;
        this.rotation += this.rotationSpeed;
        this.draw();
    }
}

function getRandomColor() {
    var colors = ["#FF6347", "#FF69B4", "#FFD700", "#00BFFF", "#20B2AA", "#9370DB"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createHeart(x, y) {
    if (hearts.length >= 100) {
        hearts.shift(); // 가장 오래된 하트 삭제
    }
    var heart = new HeartObject(x, y);
    hearts.push(heart);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < hearts.length; i++) {
        hearts[i].update();
    }
    requestAnimationFrame(render);
}

canvas.addEventListener("mousemove", function (event) {
    canvas.style.cursor = "none";
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;
    createHeart(mouseX, mouseY);
});

setInterval(function() {
    var mouseX = Math.random() * canvas.width;
    var mouseY = Math.random() * canvas.height;
    createHeart(mouseX, mouseY);
}, 200);

render();
