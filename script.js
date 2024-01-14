
let direction = {x: 0, y: 0}; // Dimensions of snake head
const bgm = new Audio("bgm.mp3");
const eatSound = new Audio("crunch.wav");
const gameOverSound = new Audio("game-over.mp3");
const moveSound = new Audio("move.mp3");
let lastTime = 0;
let speed = 10; // Speed parameter
let snakeArr = [{x: 13, y: 15}]; // snake body
let foodPos = {x: 2, y: 3};
let score = 0;
let highScore = localStorage.getItem('highScore')? localStorage.getItem('highScore'): 0;



// Game Loop
function game(currTime) {
    window.requestAnimationFrame(game);
    // Setting the fps
    if((currTime - lastTime) / 1000 < (1 / speed)) return;
    lastTime = currTime;
    gameEngine();
}

function collision(sArr) {
    for(i = 1; i < sArr.length; i++) {
        if(sArr[0].x === sArr[i].x && sArr[0].y === sArr[i].y){
            return true;
        }
    }
    if(sArr[0].x <= 0 || sArr[0].x >= 18 || sArr[0].y >= 18 || sArr[0].y <= 0){
        return true;
    }

}

// Frame updation
function gameEngine() {

    bgm.play();

    // Update the snake body and food

    // Handling game over
    if(collision(snakeArr)) {
        gameOverSound.play();
        bgm.pause();
        direction = {x : 0, y : 0};
        alert("Game is over! Press any key to try again.");
        score = 0;
        snakeArr = [{x : 13, y : 15}];
        bgm.play();
    }

    // Handling snake eats food
    if(snakeArr[0].x === foodPos.x && snakeArr[0].y === foodPos.y) {
        eatSound.play();
        score += 1;
        snakeArr.unshift({x : snakeArr[0].x + direction.x, y : snakeArr[0].y + direction.y}); // appending snake body
        let a = 2, b = 16; // range in which food appears
        foodPos = {x: a + (b - a)*Math.round(Math.random()), y: a + (b - a)*Math.round(Math.random())}; // regenerating food
    }

    //Handling snake movement
    // Every body segment replaces its previous segment and head moves to the new position
    for(i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]}; // Destructuring creates a new object. Prevents any reference issue
    }
    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // Display the next frame
    let board = document.getElementsByClassName('board')[0];
    board.innerHTML = ""; 

    //Snake Body
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('body');
        }
        board.appendChild(snakeElement);
    });

    // Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = foodPos.y;
    foodElement.style.gridColumnStart = foodPos.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    //Score Logic
    let scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `Score : ${score}`;

    //High Score Logic
    let highScoreElement = document.getElementById('highScore');
    if(score > highScore) {
        localStorage.setItem('highScore', score);
        highScore = score;
    }
    highScoreElement.innerHTML = `High Score : ${highScore}`;
}

// Action Logic
window.requestAnimationFrame(game);

window.addEventListener('keydown', (e) => {
    moveSound.play();
    direction = {x: 0, y: 1};
    switch(e.key) {
        case 'ArrowUp':
            direction.x = 0;
            direction.y = -1;
            break;
        case 'ArrowDown':
            direction.x = 0;
            direction.y = 1;
            break;
        case 'ArrowLeft':
            direction.x = -1;
            direction.y = 0;
            break;
        case 'ArrowRight':
            direction.x = 1;
            direction.y = 0;
            break;     
    }
})