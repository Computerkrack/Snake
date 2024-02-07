let temp = '!!temp42!!'

let board;
let blockSize = 27 % screen.height;
let rows = 20;
let cols = 20;
let ctx;
let foodX = 10 * blockSize;
let foodY = 10 * blockSize;
let SnakeHeadX = 0;
let SnakeHeadY = 0;
let speedX = 0;
let speedY = 0;
let snakeBody = [];
let gameOver = false;
let gameRunning = false;

let liveScore = document.getElementById("score");
let newScore = 0;
let liveSeconds = document.getElementById("seconds");
let secondsCounted = 0;
let liveBodyLength = document.getElementById("bodylength");
let bodyLength = 0;
let liveFood = document.getElementById("colected");
let collectedFood = 0;
let finalScore = document.getElementById("finalscore");
let finalSeconds = document.getElementById("finalseconds");
let finalBodyLength = document.getElementById("finalbodylength");
let finalFood = document.getElementById("finalcolected");
let score;
let seconds;
let length;
let food;
let LiveHighScore = document.getElementById("highScore");
let LiveHighSeconds = document.getElementById("highSeconds");
let LiveHighSnakeLength = document.getElementById("highBodyLength");
let LiveHighFootEaten = document.getElementById("highColected");
let highScore;
let highSeconds;
let highLength;
let highColected;
// --------------------------- End of Variables -------------------------------------------------------------

liveScore.innerHTML = '0';
AddBody();
window.onload = function() {start();}
function restart() {
    document.getElementById("deathModal").style.display = "none";
    gameOver = false;
    gameRunning = false;
    newScore = 0;
    secondsCounted = 0;
    bodyLength = 0;
    collectedFood = 0;
    snakeBody = [0,0];
    SnakeHeadX = 0;
    SnakeHeadY = 0;
    speedY = 0;
    speedX = 0;
    start();
}
    function start () {
    document.getElementById("deathModal").style.display = 'none';
    document.getElementById("ModalButton").hidden = false;
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    ctx = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(updates, 1000/10);
    setInterval(secondsCounter, 1000);
    setInterval(sendToHTML, 1)
    setInterval(sendToHTMLgameOver, 1000/10)
}


function changeDirection() {
    if (wallCheck() !== true) {
        switch (event.code) {
            case "KeyW":
            case "KeyK":
            case "ArrowUp":
                if (speedY !== 1) {
                    speedX = 0;
                    speedY = -1;
                }
                gameRunning = true
                break;
            case "KeyS":
            case "KeyJ":
            case "ArrowDown":
                if (speedY !== -1) {
                    speedX = 0;
                    speedY = 1;
                }
                gameRunning = true
                break;
            case "KeyA":
            case "KeyH":
            case "ArrowLeft":
                if (speedX !== 1) {
                    speedX = -1;
                    speedY = 0;
                }
                gameRunning = true
                break;
            case "KeyD":
            case "KeyL":
            case "ArrowRight":
                if (speedX !== -1) {
                    speedX = 1;
                    speedY = 0;
                }
                gameRunning = true
                break;
        }
    }
}

function placeFood() {
    foodX = Math.floor(rows * Math.random()) * blockSize;
    foodY = Math.floor(cols * Math.random()) * blockSize;
}

function updates() {
    if (gameOver) {
        return;
    } else if (gameRunning) {
        document.getElementById("ModalButton").hidden = true;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, rows * blockSize, cols * blockSize);

    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, blockSize, blockSize);

    moveUpdate();
    foodCheck();
    sendToHTML();
}

function foodCheck() {
    if (foodX === SnakeHeadX && foodY === SnakeHeadY) {
        AddBody(foodX, foodY);
        placeFood();
        newScore += 10;
        collectedFood += 1;
    }
}

function AddBody(x, y) {
    bodyLength += 1
    snakeBody.push([x,y]);
}

function wallCheck() {
    switch (true) {
        case SnakeHeadY < 0:
            SnakeHeadY = rows * blockSize;
            return true;
        case SnakeHeadY >= rows * blockSize:
            SnakeHeadY = -1 * blockSize;
            return true;
        case SnakeHeadX < 0:
            SnakeHeadX = cols * blockSize;
            return true;
        case SnakeHeadX >= cols * blockSize:
            SnakeHeadX = -1 * blockSize;
            return true;
    }
}

function moveUpdate() {
    wallCheck();

    ctx.fillStyle = 'lime';

    ctx.fillRect(SnakeHeadX += speedX * blockSize, SnakeHeadY += speedY * blockSize, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {

        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize)
    }
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [SnakeHeadX, SnakeHeadY];
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody.length < 2) {
            break
        } else if (snakeBody[i][0] === SnakeHeadX && snakeBody[i][1] === SnakeHeadY && bodyLength !== 0) {
            gameOver = true;
            gameRunning = false;
            document.getElementById("ModalButton").hidden = false;
            document.getElementById("deathModal").style.display = 'block';
        }
    }
}

function secondsCounter() {
    if (gameRunning === true) {
        secondsCounted += 1
        newScore += 1
    }
}

function sendToHTML() {
    if (gameRunning) {
        liveSeconds.innerHTML = secondsCounted;
        liveScore.innerHTML = newScore;
        liveBodyLength.innerHTML = bodyLength;
        liveFood.innerHTML = collectedFood;
    }
}

function sendToHTMLgameOver() {
    updateHighScore();
    score = newScore;
    seconds = secondsCounted;
    length = bodyLength;
    food = collectedFood;
    finalSeconds.innerHTML = seconds;
    finalScore.innerHTML = score;
    finalBodyLength.innerHTML=  length;
    finalFood.innerHTML = food;
    recentGamesTableWriter();
}

function updateHighScore() {
    highScore = temp
    highSeconds = temp
    highLength = temp
    highColected = temp
    LiveHighScore.innerHTML = highScore
    LiveHighSeconds.innerHTML = highSeconds
    LiveHighSnakeLength.innerHTML = highLength
    LiveHighFootEaten.innerHTML = highColected
}

function recentGamesTableWriter () {
    let table = document.getElementById("recentGamesTable");
    let row = table.insertRow(1);
    let cell1= row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 =  row.insertCell(3);

    cell1.innerHTML = temp //finalScore;
    cell2.innerHTML = temp //finalSeconds;
    cell3.innerHTML = temp //finalBodyLength;
    cell4.innerHTML = temp //finalFood;
}