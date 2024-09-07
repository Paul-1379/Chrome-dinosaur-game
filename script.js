
//board
let board;
let boardWidth = 750;
let boardHeight = 450;
let context;

//dino
let dinoWidth = 88;
let dinoHeigth = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeigth;
let dinoImg;

let dino = {
    width: dinoWidth,
    height: dinoHeigth,
    x: dinoX,
    y: dinoY
}

//cactus
let cactusArray = [];

let cactusWidths = [
    34,
    69,
    102
]
let cactusHeight = 70;

let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactusImgs = [3];

//game physics
let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;
let scoreVelocity = 1;

window.onload = function(){

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    for (let index = 0; index < 3; index++) {
        let cactusImg = new Image();
        cactusImg.src = "./img/cactus" + (index + 1) + ".png";
        cactusImgs[index] = cactusImg;
    }

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", dinoMove);
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    

    context.clearRect(0, 0, board.width, board.height);
    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let index = 0; index < cactusArray.length; index++) {
        let cactus = cactusArray[index];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(dino, cactus)){
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function(){
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    score += scoreVelocity;
    context.fillStyle = "black";
    context.font = "20px courier"
    context.fillText(score, 5, 20)
}
function dinoMove(e){
    if(gameOver){
        return;
    }

    if((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY){
        velocityY = -10;
    }
}
function placeCactus(){

    if(gameOver){
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if(placeCactusChance > 0.90){
        cactus.img = cactusImgs[2];
        cactus.width = cactusWidths[2];
    }else if(placeCactusChance > 0.70){
        cactus.img = cactusImgs[1];
        cactus.width = cactusWidths[1];
    }else{
        cactus.img = cactusImgs[0];
        cactus.width = cactusWidths[0];
    }
    cactusArray.push(cactus);

    if(cactusArray.length > 5){
        cactusArray.shift();
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
}