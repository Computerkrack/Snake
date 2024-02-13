// ----- temp only for development -----
let temp = '!!temp42!!';
// ----- JS ----- //
let board;
let blockSize = 25 % screen.height;
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
let recentGame = [];
let recentGamesArray = [];
// let HSArr = [0,0,0,0];
// let newHighScoreWritten = false;


// ----- from/for HTML -----
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
let highScore = undefined;
let highSeconds = undefined;
let highLength = undefined;
let highColected = undefined;
let LSClearButton = document.getElementById("clearLSButton");


// --------------------------- End of Variables -------------------------------------------------------------

liveScore.innerHTML = '0';
liveSeconds.innerHTML = '0';
liveBodyLength.innerHTML = '0';
liveFood.innerHTML = '0';

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
    document.getElementById("ModalButton").hidden = false;
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    ctx = board.getContext("2d");
    placeFood();
    document.addEventListener("keyup", changeDirection);
}

function start () {
    //localStorageReader();
    updateHighScore();
    for (let i = 0; i < recentGamesArray.length; i++) {
        recentGamesTableWriter(i);
    }
    document.getElementById("deathModal").style.display = 'none';
    document.getElementById("ModalButton").hidden = false;
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    ctx = board.getContext("2d");
    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(updates, 100);
    setInterval(secondsCounter, 1000);
    setInterval(sendToHTML, 1);
    setInterval(updateHighScore, 1000);
    setInterval(hide, 1000);
    setInterval(localStorageWriter, 10000);
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
            deleteRGTable();
            sendToHTMLgameOver();
            addRecentGame(newScore, secondsCounted, bodyLength, collectedFood);
            for (let i = 0; i < recentGamesArray.length; i++) {
                recentGamesTableWriter(i);
            }
        }
    }
}

function secondsCounter() {
    if (gameRunning && !gameOver) {
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
}

function updateHighScore() {
    // if (HSArr.length < 4) {
    //     writeHighScore();
    // }
    if (newScore + secondsCounted + bodyLength + collectedFood > highScore + highSeconds + highLength + highColected) {
        highScore = newScore;
        highSeconds = secondsCounted;
        highLength = bodyLength;
        highColected = collectedFood;
    } else if (recentGamesArray.length < 1) {
        highScore = newScore;
        highSeconds = secondsCounted;
        highLength = bodyLength;
        highColected = collectedFood;
    }
    if (highScore === undefined) {
        highScore = newScore;
        highSeconds = secondsCounted
        highLength = bodyLength;
        highColected = collectedFood;
    }
    LiveHighScore.innerHTML = highScore;
    LiveHighSeconds.innerHTML = highSeconds;
    LiveHighSnakeLength.innerHTML = highLength;
    LiveHighFootEaten.innerHTML = highColected;
}

// function writeHighScore() {
//     HSArr = JSON.parse(localStorage.getItem("LHSArr"));
//     alert(HSArr)
//     highScore = HSArr[0];
//     highSeconds = HSArr[1];
//     highLength = HSArr[2];
//     highColected = HSArr[3];
//
// }

function recentGamesTableWriter (i) {
    let table = document.getElementById("recentGamesTable");
    let row = table.insertRow(1);
    let cell1= row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 =  row.insertCell(3);
    cell1.innerHTML = recentGamesArray[i][0].toString();
    cell2.innerHTML = recentGamesArray[i][1].toString();
    cell3.innerHTML = recentGamesArray[i][2].toString();
    cell4.innerHTML = recentGamesArray[i][3].toString();
}

function addRecentGame(score, seconds, length, colected) {
    recentGame.push(score, seconds, length, colected);
    recentGamesArray.push(recentGame);
    recentGame = [];
}

function deleteRGTable () {
    let RGTable = document.getElementById("recentGamesTable")
    for (let i = RGTable.rows.length; i > 1; i--) {
        RGTable.deleteRow(-1)
    }
}

function localStorageWriter () {
    localStorage.removeItem(recentGamesArray);
    // localStorage.removeItem(HSArr);
    localStorage.setItem("LRGArr", JSON.stringify(recentGamesArray));
    // localStorage.setItem("LHSArr", JSON.stringify(HSArr));
}
//function localStorageReader () {
    //recentGamesArray = JSON.parse(localStorageRGArrtem("LRGArr"));
// }


function hide () {
    if(gameRunning) {
        LSClearButton.style.display = "none";
    } else {
        LSClearButton.style.display = "block";
    }
}
LSClearButton.onclick = function () {
    localStorage.clear();
    deleteRGTable();
    recentGamesArray = [];
}