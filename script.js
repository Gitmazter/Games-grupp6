const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const reset_btn = document.querySelector("#reset");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const ballDiameter = 20;
const boardHeight = 300;
let timerId = 0;
let xDirection = -2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart; // kallar denna

const ballStart = [270, 40];
let ballCurrentPosition = ballStart; // kallar denna
//create block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// music when game starts
let mySound = new Audio('sounds/pixel-perfect-112527.mp3');
mySound.play();

// all my blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

console.log(blocks[0]);

// draw my block
function addBlock() {
  console.log("addblock starts");
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlock(); // Kalla vid reset

const user = document.createElement("div");
// add user INIT
function startUser () {
  console.log("start user starts");
  //const user = document.createElement("div");
  user.classList.add("user");
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
  grid.appendChild(user);
}
startUser (); // Kalla vid reset

//draw the ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

//draw user
function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

//move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 20;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 20;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// add ball INIT
const ball = document.createElement("div");

function startBall () {
  console.log("start ball starts");
  ball.classList.add("ball");
  drawBall();
  grid.appendChild(ball);
}
startBall (); // Kalla vid reset

//move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 10);

reset_btn.addEventListener ('click', function () {
      /* grid.innerHTML= ""
      xDirection = -2;
      yDirection = 2;
      currentPosition = userStart;
      drawUser();
      ballCurrentPosition = ballStart;
      drawBall();
      document.addEventListener("keydown", moveUser);
      timerId = setInterval(moveBall, 10);
      addBlock();
      startUser();
      startBall(); */
      // much easier
      location.reload();
}); 

function checkForCollisions() {
  console.log("checking for colissions")
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "YOU WIN!!!";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }

  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You Lose!";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
