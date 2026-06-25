// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerTick; // Stores countdown interval
let score = 0;
let timeLeft = 30;

const startButton = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const feedbackDisplay = document.getElementById("feedback-message");

// Wait for button click to start the game
startButton.addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTime();
  gameContainer.innerHTML = "";
  startButton.textContent = "Playing...";
  setFeedback("Collect clean drops (+2). Avoid dirty drops (-3).", "good");

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 700);
  timerTick = setInterval(updateGameTimer, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const isBadDrop = Math.random() < 0.2;
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = `${Math.random() * 1.5 + 2.5}s`;
  let dropHandled = false;

  drop.addEventListener("click", () => {
    if (!gameRunning || dropHandled) return;

    dropHandled = true;
    if (isBadDrop) {
      score -= 3;
      setFeedback("Dirty drop! -3 points", "bad");
    } else {
      score += 2;
      setFeedback("Great catch! +2 points", "good");
    }
    updateScore();
    drop.remove();
  });

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    if (!dropHandled && gameRunning && !isBadDrop) {
      score -= 1;
      updateScore();
      setFeedback("Missed clean drop! -1 point", "bad");
    }

    dropHandled = true;
    drop.remove(); // Clean up drops that weren't caught
  });
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateTime() {
  timeDisplay.textContent = timeLeft;
}

function updateGameTimer() {
  timeLeft -= 1;
  updateTime();

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerTick);
  gameContainer.innerHTML = "";
  startButton.textContent = "Start Game";
  setFeedback(`Time up! Final score: ${score}`, "good");
}

function setFeedback(message, type) {
  feedbackDisplay.textContent = message;
  feedbackDisplay.classList.remove("good", "bad");

  if (type) {
    feedbackDisplay.classList.add(type);
  }
}
