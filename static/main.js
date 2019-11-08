var title = document.getElementById('title');
var gameover;
// var btnStartGame = document.getElementById('btnStartgame');
var canvas;
var score = 0;
var IsAlive = false;
var snake = [];
var v = 10;
var food;
var enemies = [];
var btnStartGame;
var data = document.getElementById('sendInfo');


function updateTitle() {
    title.innerHTML = 'Score:' + score;
}
function startGame() {
    btnStartGame = document.getElementById('btnStartgame');
    enemies = [];
    gameover = document.getElementById('gameover');
    gameover.innerHTML = "";
    canvas = document.getElementById('game_canvas');
    score = 0;
    IsAlive = true;
    snake = [{ 'x': 150, 'y': 150 }];
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    generateFood();
    updateScore();
}
function drawSnakePart(snakePart) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(snakePart['x'], snakePart['y'], 10, 10);
}
function drawSnake() {
    for (x = 0; x < snake.length; x++) {
        drawSnakePart(snake[x]);
    }
}
function generateFood() {
    var x = getRandomInt(0, 32) * 10;
    var y = getRandomInt(0, 32) * 10;
    food = { 'y': y, 'x': x };
    drawFood();
}
function drawFood() {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'green';
    ctx.fillRect(food['x'], food['y'], 10, 10);
}
onkeypress = function (key) {
    console.log(key.key);
    if (IsAlive) {
        var strKey = key.key.toLowerCase();
        if (strKey == 'w') {
            move(1, 'y');
        }
        if (strKey == 's') {
            move(-1, 'y');
        }
        if (strKey == 'a') {
            move(1, 'x');
        }
        if (strKey == 'd') {
            move(-1, 'x');
        }
        colition();
        updateEnemies();
        drawGame();
    } else {

        this.console.log('Please start the game.')
    }
}
function move(d, h) {
    enemies.push(addEnemy());
    snake[0][h] -= 10 * d;
}
function updateEnemies() {
    for (let index = 0; index < enemies.length; index++) {
        if (snake[0]['x'] < enemies[index]['x']) {
            enemies[index]['x'] -= 5;
        } else {
            enemies[index]['x'] += 5;
        }
        if (snake[0]['y'] < enemies[index]['y']) {
            enemies[index]['y'] -= 5;
        } else {
            enemies[index]['y'] += 5;
        }
        if (enemies[index]['x'] == snake[0]['x'] && enemies[index]['y'] == snake[0]['y']) {
            IsAlive = false;
            gameover.innerHTML = "FINAL SCORE:" + score;
            score.innerHTML = "";
            btnStartGame.style.display = 'none';
            data.style.visibility = 'visible';
            data.style.display = 'block';
        }
    }
}
function addEnemy() {

    newEnemy = { 'x': getRandomInt(0, 32) * 10, 'y': getRandomInt(0, 32) * 10 };
    if (newEnemy['x'] == food['x'] && newEnemy['y'] == food['y']) {
        newEnemy = addEnemy();
    }
    return newEnemy;
}
function colition() {
    if (snake[0]['y'] == food['y'] && snake[0]['x'] == food['x']) {
        score++;
        updateTitle();
        updateScore();
        generateFood();
        enemies = [];
    }
}
function updateScore() {
    var score_text = document.getElementById('score');
    score_text.innerHTML = 'Score:' + score;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function drawEnemies() {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'blue';
    for (i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i]['x'], enemies[i]['y'], 10, 10);
    }
}
function drawGame() {
    /*
     Este metodo borra el canvas.
    */
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawEnemies();
}


function sendScore() {
    var name = document.getElementById('name').value;
    var URL = 'http://192.168.0.132:5000/addScore?';
    URL = URL + 'name=' + name + '&';
    URL = URL + 'score=' + score;
    var request = new XMLHttpRequest();
    var promise = new Promise(function (resolve,reject) {
        request.open('POST', URL, true)
        request.send();
    });
    btnStartGame.style.display = 'block';
    var location = window.location['href'];
    window.location = location;
}