let board = document.getElementById("board");
let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");
let sizeInput = document.getElementById("size");
let scoreboard = document.getElementById("scoreboard");

let currentPlayer = "X";
let gameOver = false;
let n;
let cells = [];
let score = { X: 0, O: 0 };

startBtn.addEventListener("click", () => {
  n = parseInt(sizeInput.value);
  if (!n || n < 3) return alert("Please enter a size of 3 or more!");

  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${n}, 70px)`;
  board.style.gridTemplateRows = `repeat(${n}, 70px)`;
  gameOver = false;
  cells = [];

  for (let i = 0; i < n * n; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
    cells.push(cell);

    cell.addEventListener("click", () => makeMove(cell, i));
  }
});

function makeMove(cell, index) {
  if (gameOver || cell.innerText !== "") return;
  cell.innerText = currentPlayer;
  cell.style.color = currentPlayer === "X" ? "#0984e3" : "#d63031";

  if (checkWin()) {
    score[currentPlayer]++;
    updateScore();
    playSound("win");
    alert(`${currentPlayer} wins!`);
    gameOver = true;
    return;
  }

  if (cells.every(c => c.innerText !== "")) {
    playSound("draw");
    alert("It's a draw!");
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  playSound("move");
}

function checkWin() {
  let grid = Array.from({ length: n }, (_, i) =>
    cells.slice(i * n, i * n + n).map(c => c.innerText)
  );

  // rows + columns
  for (let i = 0; i < n; i++) {
    if (grid[i].every(v => v && v === grid[i][0])) {
      highlightWinningCells("row", i);
      return true;
    }
    if (grid.map(r => r[i]).every(v => v && v === grid[0][i])) {
      highlightWinningCells("col", i);
      return true;
    }
  }

  // diagonals
  if (grid.map((r, i) => r[i]).every(v => v && v === grid[0][0])) {
    highlightWinningCells("diag1");
    return true;
  }
  if (grid.map((r, i) => r[n - 1 - i]).every(v => v && v === grid[0][n - 1])) {
    highlightWinningCells("diag2");
    return true;
  }

  return false;
}

function highlightWinningCells(type, index) {
  let winCells = [];
  if (type === "row") {
    winCells = cells.slice(index * n, index * n + n);
  } else if (type === "col") {
    for (let i = 0; i < n; i++) winCells.push(cells[i * n + index]);
  } else if (type === "diag1") {
    for (let i = 0; i < n; i++) winCells.push(cells[i * n + i]);
  } else {
    for (let i = 0; i < n; i++) winCells.push(cells[i * n + (n - 1 - i)]);
  }
  winCells.forEach(c => c.classList.add("winner"));
}

function updateScore() {
  scoreboard.innerText = `X: ${score.X} | O: ${score.O}`;
}

function playSound(type) {
  const sounds = {
    move: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5a56c64b17.mp3"),
    win: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_3ffdb5a57e.mp3"),
    draw: new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_42cbd2e83f.mp3")
  };
  sounds[type].play();
}

resetBtn.addEventListener("click", () => {
  board.innerHTML = "";
  sizeInput.value = "";
  currentPlayer = "X";
  score = { X: 0, O: 0 };
  updateScore();
});

