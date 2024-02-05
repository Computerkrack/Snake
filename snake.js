let board;
let blockSice= 30 % screen.height;
let rows = 20;
let cols = 20;
let ctx;
let foodX = 10 * blockSice;
let foodY = 10 * blockSice;
let foodArr;
let SnakeHeadX = 0;
let SnakeHeadY = 0;
let SnakeHeadArr;
let speedX = 0;
let speedY = 0;
let snakeBody = [];
let gameOver = false;
let score = document.getElementById("score");
let newScore = 0

AddBody(2);
window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSice;
    board.width = cols * blockSice;
    ctx = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(updates, 1000/10);
}


function changeDirection() {
    switch(event.code) {
        case "KeyW":
        case "KeyK":
        case "ArrowUp":
            if (speedY !== 1) {
                speedX = 0;
                speedY = -1;
            }
            break;
        case "KeyS":
        case "KeyJ":
        case "ArrowDown":
            if (speedY !== -1) {
                speedX = 0;
                speedY = 1;
            }
            break;
        case "KeyA":
        case "KeyH":
        case "ArrowLeft":
            if (speedX !== 1) {
                speedX = -1;
                speedY = 0;
            }
            break;
        case "KeyD":
        case "KeyL":
        case "ArrowRight":
            if (speedX !== -1) {
                speedX = 1;
                speedY = 0;
            }
            break;
    }
}

function placeFood() {
    foodX = Math.floor(rows * Math.random()) * blockSice;
    foodY = Math.floor(cols * Math.random()) * blockSice;
}

function updates() {
    if (gameOver) {
        return;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, rows * blockSice, cols * blockSice);

    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, blockSice, blockSice);

    moveUpdate();
    foodCheck();
}

function foodCheck() {
    if (foodX === SnakeHeadX && foodY === SnakeHeadY) {
        AddBody(1, foodX, foodY);
        placeFood();
        newScore += 10
        score.innerHTML = newScore;
    }
}

function AddBody(amount, x, y) {
    snakeBody.push([x,y]);
}

function moveUpdate() {
    switch(true) {
        case SnakeHeadY < 0:
            SnakeHeadY = rows * blockSice;
            break;
        case SnakeHeadY >= rows * blockSice:
            SnakeHeadY = -1 * blockSice;
            break;
        case SnakeHeadX < 0:
            SnakeHeadX = cols * blockSice;
            break;
        case SnakeHeadX >= cols * blockSice:
            SnakeHeadX = -1 * blockSice;
            break;
    }

    ctx.fillStyle = 'lime';

    ctx.fillRect(SnakeHeadX += speedX * blockSice, SnakeHeadY += speedY * blockSice, blockSice, blockSice);
    for (let i = 0; i < snakeBody.length; i++) {

        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], blockSice, blockSice)
    }
    for (let i = snakeBody.length-1;i > 0;i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [SnakeHeadX, SnakeHeadY];
    }

    for (i = 1; i < snakeBody.length; i++) {
        if (snakeBody.length < 2) {
            break
        } else if (snakeBody[i][0] === SnakeHeadX && snakeBody[i][1] === SnakeHeadY) {
            gameOver = true;
            alert ("gameOver");
        }
    }
}