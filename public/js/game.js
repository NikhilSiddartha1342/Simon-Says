const colors = ['green', 'red', 'yellow', 'blue'];
let gameSequence = [];
let userSequence = [];
let score = 0;
let acceptingInput = false;

const sounds = {
  green: document.getElementById('sound-green'),
  red: document.getElementById('sound-red'),
  yellow: document.getElementById('sound-yellow'),
  blue: document.getElementById('sound-blue'),
  error: document.getElementById('sound-error')
};

function playSound(color) {
  if (sounds[color]) {
    sounds[color].currentTime = 0;
    sounds[color].play();
  }
}

function flashButton(color) {
  const btn = document.getElementById(color);
  btn.classList.add('active');
  playSound(color);
  setTimeout(() => {
    btn.classList.remove('active');
  }, 350);
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function playSequence() {
  acceptingInput = false;
  for (const color of gameSequence) {
    flashButton(color);
    await sleep(500);
  }
  acceptingInput = true;
}

function nextRound() {
  userSequence = [];
  const nextColor = colors[Math.floor(Math.random() * 4)];
  gameSequence.push(nextColor);
  playSequence();
}

function resetGame() {
  gameSequence = [];
  userSequence = [];
  score = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('gameMessage').textContent = '';
}

function gameOver() {
  acceptingInput = false;
  playSound('error');
  document.getElementById('gameMessage').textContent = 'Game Over! Your score: ' + score;
  updateScoreOnServer(score);
}

async function updateScoreOnServer(latestScore) {
  // Update highScore if needed
  const res = await fetch('/game/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score: latestScore })
  });
  if (res.ok) {
    const data = await res.json();
    document.getElementById('highScore').textContent = data.highScore;
  }
}

colors.forEach(color => {
  document.getElementById(color).onclick = () => {
    if (!acceptingInput) return;
    flashButton(color);
    userSequence.push(color);

    // Check user input
    if (userSequence[userSequence.length - 1] !== gameSequence[userSequence.length - 1]) {
      gameOver();
      return;
    }

    if (userSequence.length === gameSequence.length) {
      score++;
      document.getElementById('score').textContent = score;
      setTimeout(nextRound, 800);
    }
  };
});

document.getElementById('startBtn').onclick = () => {
  resetGame();
  nextRound();
};

document.getElementById('resetBtn').onclick = () => {
  resetGame();
};

resetGame();
