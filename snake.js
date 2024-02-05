let board;
let blockSice= 65;
let rows = 20;
let cols = 20;
let ctx;
let foodX = 10 * blockSice;
let foodY = 10 * blockSice;
let headX;
let headY;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSice;
    board.width = cols * blockSice;
    ctx = board.getContext("2d");

    placeFood();
    updates();
}

function placeFood() {
    foodX = Math.floor(rows * Math.random()) * blockSice;
    foodY = Math.floor(cols * Math.random()) * blockSice;
}

function updates() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, rows * blockSice, cols * blockSice);

    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, blockSice, blockSice);
}