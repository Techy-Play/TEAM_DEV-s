// JavaScript for Snake & Ladder Game

const boardSize = 10;
const totalCells = boardSize * boardSize;
const boardElement = document.getElementById('board');
const rollDiceBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const playerPositionDisplay = document.getElementById('player-position');

let playerPosition = 1;

// Define snakes and ladders as key-value pairs: start -> end
const snakes = {
    16: 6,
    48: 26,
    49: 11,
    56: 53,
    62: 19
};

const ladders = {
    2: 38,
    7: 14,
    8: 31,
    15: 26,
    28: 84
};

// Create the board cells dynamically
function createBoard() {
    boardElement.innerHTML = '';
    let isLeftToRight = true;

    // We will create rows from bottom to top
    for (let row = boardSize - 1; row >= 0; row--) {
        let rowCells = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            rowCells.push(cell);
        }
        if (isLeftToRight) {
            rowCells.forEach(cell => boardElement.appendChild(cell));
        } else {
            rowCells.reverse().forEach(cell => boardElement.appendChild(cell));
        }
        isLeftToRight = !isLeftToRight;
    }

    // Number the cells starting from bottom-left to top-right with alternating direction per row
    const cells = boardElement.querySelectorAll('.cell');
    let cellNumber = 1;
    for (let row = boardSize - 1; row >= 0; row--) {
        if ((boardSize - 1 - row) % 2 === 0) {
            // left to right numbering
            for (let col = 0; col < boardSize; col++) {
                cells[row * boardSize + col].textContent = cellNumber++;
            }
        } else {
            // right to left numbering
            for (let col = boardSize - 1; col >= 0; col--) {
                cells[row * boardSize + col].textContent = cellNumber++;
            }
        }
    }
}

// Update player position on the board
function updatePlayerPosition() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('player'));
    if (playerPosition <= totalCells) {
        cells[playerPosition - 1].classList.add('player');
    }
    playerPositionDisplay.textContent = `Player Position: ${playerPosition}`;
}

// Roll dice and move player
function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `Roll: ${roll}`;

    let nextPosition = playerPosition + roll;
    if (nextPosition > totalCells) {
        // Overshoot case: do not move
        nextPosition = playerPosition;
    } else {
        // Check for snakes or ladders
        if (snakes[nextPosition]) {
            nextPosition = snakes[nextPosition];
        } else if (ladders[nextPosition]) {
            nextPosition = ladders[nextPosition];
        }
    }

    playerPosition = nextPosition;
    updatePlayerPosition();

    if (playerPosition === totalCells) {
        alert('Congratulations! You have won the game!');
        rollDiceBtn.disabled = true;
    }
}

// Initialize game
function initGame() {
    createBoard();
    updatePlayerPosition();
    rollDiceBtn.addEventListener('click', rollDice);
}

window.onload = initGame;
