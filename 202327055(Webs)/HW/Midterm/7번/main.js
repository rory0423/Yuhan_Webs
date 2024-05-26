const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');

startButton.addEventListener('mouseover', function() {
    startButton.style.backgroundColor = '#FFFF00'; // 마우스를 위로 올렸을 때 노란색으로 변경
});

startButton.addEventListener('mouseout', function() {
    startButton.style.backgroundColor = '#FFFFFF'; // 마우스를 버튼 바깥으로 이동했을 때 다시 하얀색으로 변경
});

startButton.addEventListener('click', function() {
    startButton.style.backgroundColor = '#800080'; // 클릭 시 보라색으로 변경
    setTimeout(function() {
        window.location.href = '../6번/main.html'; // 게임 화면으로 이동(3번은 없기에 임시로 2번)
    }, 1000);
});