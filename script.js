document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const rollButton = document.getElementById('roll-dice');
    const diceResult = document.querySelector('.roll');
    const positionDisplay = document.querySelector('.position');
    const rollsDisplay = document.querySelector('.stat span:first-child');
    let rolls = 0;
    let currentPosition = 1;
    let isAnimating = false;

    // Snake and Ladder positions
    const specialMoves = {
        4: 25,
        12: 6,
        35: 76,
        40: 80,
        46: 29,
        59: 84,
        70: 28,
        72: 94,
        75: 48,
        99: 20
    };

    // Create game board with correct numbering
    function createBoard() {
        board.innerHTML = '';
        const cells = Array(100).fill(null);
        
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const row = Math.floor(i / 10);
            const col = i % 10;
            
            let number;
            if (row % 2 === 0) {
                number = (10 * (9 - row)) + (9 - col) + 1;
            } else {
                number = (10 * (9 - row)) + col + 1;
            }
            
            cell.textContent = number;
            cell.setAttribute('data-position', number);

            if (specialMoves[number]) {
                cell.classList.add(specialMoves[number] > number ? 'ladder-start' : 'snake-start');
            }
            
            cells[i] = cell;
        }
        
        cells.forEach(cell => board.appendChild(cell));
    }

    // Update dice face
    function updateDiceFace(number) {
        const diceFace = document.querySelector('.dice-face');
        if (!diceFace) return;
        
        diceFace.innerHTML = '';
        
        const dotPositions = {
            1: [[50, 50]],
            2: [[25, 25], [75, 75]],
            3: [[25, 25], [50, 50], [75, 75]],
            4: [[25, 25], [25, 75], [75, 25], [75, 75]],
            5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
            6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]]
        };

        dotPositions[number].forEach(([x, y]) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.style.left = `${x}%`;
            dot.style.top = `${y}%`;
            diceFace.appendChild(dot);
        });
    }

    // Player movement animation
    function updatePlayerPosition(oldPos, newPos) {
        try {
            const oldCell = board.querySelector(`[data-position="${oldPos}"]`);
            const newCell = board.querySelector(`[data-position="${newPos}"]`);

            if (oldCell) oldCell.classList.remove('player');
            
            if (newCell) {
                const token = document.createElement('div');
                token.className = 'player-token';
                document.body.appendChild(token);

                const oldRect = oldCell.getBoundingClientRect();
                const newRect = newCell.getBoundingClientRect();

                token.style.left = `${oldRect.left + oldRect.width/2}px`;
                token.style.top = `${oldRect.top + oldRect.height/2}px`;
                token.style.transform = 'translate(-50%, -50%)';

                const animation = token.animate([
                    { 
                        left: `${oldRect.left + oldRect.width/2}px`,
                        top: `${oldRect.top + oldRect.height/2}px`
                    },
                    { 
                        left: `${newRect.left + newRect.width/2}px`,
                        top: `${newRect.top + newRect.height/2}px`
                    }
                ], {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });

                animation.onfinish = () => {
                    token.remove();
                    newCell.classList.add('player');
                    isAnimating = false;

                    if (specialMoves[newPos]) {
                        setTimeout(() => {
                            movePlayer(newPos, specialMoves[newPos], true);
                        }, 500);
                    } else if (!isAnimating) {
                        rollButton.disabled = false;
                    }
                };
            }
        } catch (error) {
            console.error('Error in updatePlayerPosition:', error);
            isAnimating = false;
            rollButton.disabled = false;
        }
    }

    // Move player
    function movePlayer(from, to, isSpecialMove = false) {
        try {
            isAnimating = true;
            updatePlayerPosition(from, to);
            currentPosition = to;
            positionDisplay.textContent = to;

            if (to === 100) {
                setTimeout(() => {
                    alert('Congratulations! You won! 🎉');
                    if (confirm('Would you like to play again?')) {
                        resetGame();
                    } else {
                        rollButton.disabled = true;
                    }
                }, 500);
            } else if (!isSpecialMove) {
                setTimeout(() => {
                    rollButton.disabled = false;
                }, 600);
            }
        } catch (error) {
            console.error('Error in movePlayer:', error);
            isAnimating = false;
            rollButton.disabled = false;
        }
    }

    // Handle dice roll
    function rollDice() {
        if (isAnimating) return;
        
        rollButton.disabled = true;
        const roll = Math.floor(Math.random() * 6) + 1;
        
        updateDiceFace(roll);
        diceResult.textContent = roll;
        
        rolls++;
        rollsDisplay.textContent = `Rolls: ${rolls}`;

        let newPosition = currentPosition + roll;
        if (newPosition > 100) {
            newPosition = currentPosition;
            rollButton.disabled = false;
        } else {
            movePlayer(currentPosition, newPosition);
        }
    }

    // Reset game
    function resetGame() {
        if (confirm('Are you sure you want to restart the game?')) {
            currentPosition = 1;
            rolls = 0;
            rollsDisplay.textContent = 'Rolls: 0';
            positionDisplay.textContent = '1';
            diceResult.textContent = '0';
            rollButton.disabled = false;
            
            const currentCell = board.querySelector('.player');
            if (currentCell) currentCell.classList.remove('player');
            
            updatePlayerPosition(0, 1);
            updateDiceFace(1);
        }
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .player-token {
            width: 24px;
            height: 24px;
            background: #8B4513;
            border-radius: 50%;
            border: 2px solid var(--white);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            pointer-events: none;
        }
        
        .cell.player {
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .dice {
            transition: transform 0.3s ease;
            transform-style: preserve-3d;
        }

        .dice-face {
            position: relative;
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }

        .dot {
            position: absolute;
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            box-shadow: inset 0 3px 3px rgba(0,0,0,0.2);
        }

        .snake-start {
            background: #ffebee !important;
        }

        .ladder-start {
            background: #e8f5e9 !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize game
    createBoard();
    updatePlayerPosition(0, 1);
    updateDiceFace(1);
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    document.getElementById('restart')?.addEventListener('click', resetGame);
});
