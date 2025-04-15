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
                const cellIndex = row * boardSize + col;
                const cell = cells[cellIndex];
                cell.textContent = cellNumber;
                cell.dataset.cellNumber = cellNumber;
                // Highlight snake and ladder cells
                if (snakes[cellNumber]) {
                    cell.classList.add('snake-cell');
                    cell.dataset.tooltip = `Snake to ${snakes[cellNumber]}`;
                }
                if (ladders[cellNumber]) {
                    cell.classList.add('ladder-cell');
                    cell.dataset.tooltip = `Ladder to ${ladders[cellNumber]}`;
                }
                cellNumber++;
            }
        } else {
            // right to left numbering
            for (let col = boardSize - 1; col >= 0; col--) {
                const cellIndex = row * boardSize + col;
                const cell = cells[cellIndex];
                cell.textContent = cellNumber;
                cell.dataset.cellNumber = cellNumber;
                // Highlight snake and ladder cells
                if (snakes[cellNumber]) {
                    cell.classList.add('snake-cell');
                    cell.dataset.tooltip = `Snake to ${snakes[cellNumber]}`;
                }
                if (ladders[cellNumber]) {
                    cell.classList.add('ladder-cell');
                    cell.dataset.tooltip = `Ladder to ${ladders[cellNumber]}`;
                }
                cellNumber++;
            }
        }
    }
}

// Update player position on the board with animation
function updatePlayerPosition(oldPosition, newPosition) {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('player');
        const indicator = cell.querySelector('.player-indicator');
        if (indicator) {
            cell.removeChild(indicator);
        }
    });
    if (newPosition <= totalCells) {
        const cell = cells[newPosition - 1];
        cell.classList.add('player');
        const indicator = document.createElement('div');
        indicator.classList.add('player-indicator');
        cell.appendChild(indicator);
    }
    playerPositionDisplay.textContent = `Player Position: ${newPosition}`;
}

// Animate player movement step by step
function animateMovement(start, end, callback) {
    if (start === end) {
        callback();
        return;
    }
    let current = start;
    const interval = setInterval(() => {
        updatePlayerPosition(current, current);
        current++;
        if (current > end) {
            clearInterval(interval);
            callback();
        } else {
            updatePlayerPosition(current - 1, current);
        }
    }, 300);
}

// Roll dice and move player with animation
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

    rollDiceBtn.disabled = true;
    animateMovement(playerPosition, nextPosition, () => {
        playerPosition = nextPosition;
        updatePlayerPosition(playerPosition, playerPosition);
        rollDiceBtn.disabled = false;
        if (playerPosition === totalCells) {
            alert('Congratulations! You have won the game!');
            rollDiceBtn.disabled = true;
        }
    });
}

// Initialize game
function initGame() {
    createBoard();
    updatePlayerPosition(0, playerPosition);
    rollDiceBtn.addEventListener('click', rollDice);
}

window.onload = initGame;
