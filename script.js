document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const rollButton = document.getElementById('roll-dice');
    const diceResult = document.querySelector('.roll');
    const positionDisplay = document.querySelector('.position');
    const rollsDisplay = document.querySelector('.stat span:first-child');
    let rolls = 0;
    let currentPosition = 1;
    let isAnimating = false;

<<<<<<< HEAD
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
=======
    // Snake and Ladder positions based on the exact image
    const snakes = {
        96: 45,  // Yellow snake
        85: 35,  // Yellow snake
        63: 22,  // Pink snake
        54: 25,  // Yellow snake
        17: 7    // Blue snake
    };

    const ladders = {
        2: 23,   // Brown ladder
        6: 26,   // Brown ladder
        20: 59,  // Brown ladder
        52: 72,  // Brown ladder
        71: 92   // Brown ladder
    };

    // Create game board with correct numbering (matching the image)
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
    function createBoard() {
        board.innerHTML = '';
        const cells = Array(100).fill(null);
        
<<<<<<< HEAD
=======
        // Create cells with correct numbering
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
<<<<<<< HEAD
            const row = Math.floor(i / 10);
            const col = i % 10;
            
            let number;
            if (row % 2 === 0) {
                number = (10 * (9 - row)) + (9 - col) + 1;
            } else {
=======
            // Calculate row and position
            const row = Math.floor(i / 10); // 0-9, bottom to top
            const col = i % 10;             // 0-9, left to right
            
            // Calculate number based on row
            let number;
            if (row % 2 === 0) {
                // Even rows (right to left)
                number = (10 * (9 - row)) + (9 - col) + 1;
            } else {
                // Odd rows (left to right)
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
                number = (10 * (9 - row)) + col + 1;
            }
            
            cell.textContent = number;
            cell.setAttribute('data-position', number);
<<<<<<< HEAD

            if (specialMoves[number]) {
                cell.classList.add(specialMoves[number] > number ? 'ladder-start' : 'snake-start');
=======
            
            // Add snake cells with specific colors and SVG paths
            if (snakes[number]) {
                cell.classList.add('snake-cell');
                if (number >= 85) {
                    cell.classList.add('yellow-snake');
                    cell.innerHTML += `<svg class="snake-path" viewBox="0 0 100 100">
                        <path d="M30,20 Q50,50 30,80" stroke-width="6"/>
                        <circle cx="30" cy="20" r="5"/>
                    </svg>`;
                } else if (number === 63) {
                    cell.classList.add('pink-snake');
                    cell.innerHTML += `<svg class="snake-path" viewBox="0 0 100 100">
                        <path d="M20,30 Q50,50 80,30" stroke-width="6"/>
                        <circle cx="20" cy="30" r="5"/>
                    </svg>`;
                } else if (number === 54) {
                    cell.classList.add('yellow-snake');
                    cell.innerHTML += `<svg class="snake-path" viewBox="0 0 100 100">
                        <path d="M70,20 Q50,50 30,80" stroke-width="6"/>
                        <circle cx="70" cy="20" r="5"/>
                    </svg>`;
                } else if (number === 17) {
                    cell.classList.add('blue-snake');
                    cell.innerHTML += `<svg class="snake-path" viewBox="0 0 100 100">
                        <path d="M20,30 Q50,50 80,30" stroke-width="6"/>
                        <circle cx="20" cy="30" r="5"/>
                    </svg>`;
                }
                cell.setAttribute('data-tooltip', `Snake to ${snakes[number]}`);
            }
            
            // Add ladder cells with SVG paths
            if (ladders[number]) {
                cell.classList.add('ladder-cell');
                cell.innerHTML += `<svg class="ladder-path" viewBox="0 0 100 100">
                    <line class="ladder-side" x1="35" y1="20" x2="35" y2="80"/>
                    <line class="ladder-side" x1="65" y1="20" x2="65" y2="80"/>
                    ${Array.from({length: 6}, (_, i) => 
                        `<line class="ladder-step" x1="35" y1="${25 + i * 10}" x2="65" y2="${25 + i * 10}"/>`
                    ).join('')}
                </svg>`;
                cell.setAttribute('data-tooltip', `Ladder to ${ladders[number]}`);
            }
            
            cells[i] = cell;
        }
        
        // Append cells in correct order
        cells.forEach(cell => board.appendChild(cell));
    }

    // Enhanced dice animation
    function animateDice(callback) {
        const dice = document.querySelector('.dice');
        const diceFace = document.querySelector('.dice-face');
        let rotations = 0;
        const totalRotations = 10; // Number of random faces to show during animation
        
        function showRandomFace() {
            if (rotations < totalRotations) {
                const randomNum = Math.floor(Math.random() * 6) + 1;
                updateDiceFace(randomNum);
                dice.style.transform = `rotateX(${rotations * 360}deg) rotateY(${rotations * 720}deg)`;
                rotations++;
                setTimeout(showRandomFace, 100);
            } else {
                const finalNumber = callback();
                updateDiceFace(finalNumber);
                dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
            }
            
            cells[i] = cell;
        }
<<<<<<< HEAD
        
        cells.forEach(cell => board.appendChild(cell));
    }

    // Update dice face
    function updateDiceFace(number) {
        const diceFace = document.querySelector('.dice-face');
        if (!diceFace) return;
        
=======

        dice.style.transition = 'transform 0.1s ease';
        showRandomFace();
    }

    // Update dice face with dots
    function updateDiceFace(number) {
        const diceFace = document.querySelector('.dice-face');
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
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
<<<<<<< HEAD
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
=======
        const oldCell = board.querySelector(`[data-position="${oldPos}"]`);
        const newCell = board.querySelector(`[data-position="${newPos}"]`);

        if (oldCell) oldCell.classList.remove('player');
        
        if (newCell) {
            const token = document.createElement('div');
            token.className = 'player-token';
            document.body.appendChild(token);

            const oldRect = oldCell.getBoundingClientRect();
            const newRect = newCell.getBoundingClientRect();

            // Set initial position
            token.style.position = 'fixed';
            token.style.left = `${oldRect.left + oldRect.width/2}px`;
            token.style.top = `${oldRect.top + oldRect.height/2}px`;
            token.style.transform = 'translate(-50%, -50%)';

            // Create path animation
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

                // Check for snake or ladder
                if (snakes[newPos]) {
                    setTimeout(() => movePlayer(newPos, snakes[newPos], true), 500);
                } else if (ladders[newPos]) {
                    setTimeout(() => movePlayer(newPos, ladders[newPos], true), 500);
                }
            };
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
        }
    }

    // Move player
    function movePlayer(from, to, isSpecialMove = false) {
<<<<<<< HEAD
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
=======
        isAnimating = true;
        updatePlayerPosition(from, to);
        currentPosition = to;
        positionDisplay.textContent = to;

        if (to === 100) {
            setTimeout(() => {
                alert('Congratulations! You won! 🎉');
                rollButton.disabled = true;
            }, 500);
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
        }
    }

    // Handle dice roll
    function rollDice() {
        if (isAnimating) return;
        
        rollButton.disabled = true;
<<<<<<< HEAD
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
=======
        
        animateDice(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = roll;
            
            // Update rolls count
            rolls++;
            rollsDisplay.textContent = `Rolls: ${rolls}`;

            // Calculate new position
            let newPosition = currentPosition + roll;
            if (newPosition > 100) {
                newPosition = currentPosition;
                rollButton.disabled = false;
                return roll;
            }

            // Move player
            movePlayer(currentPosition, newPosition);
            
            setTimeout(() => {
                if (!isAnimating) rollButton.disabled = false;
            }, 600);

            return roll;
        });
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .player-token {
<<<<<<< HEAD
            width: 24px;
            height: 24px;
            background: #8B4513;
=======
            width: 20px;
            height: 20px;
            background: var(--warning-color);
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
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
<<<<<<< HEAD

        .snake-start {
            background: #ffebee !important;
        }

        .ladder-start {
            background: #e8f5e9 !important;
        }
=======
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
    `;
    document.head.appendChild(style);

    // Initialize game
    createBoard();
    updatePlayerPosition(0, 1);
    updateDiceFace(1);
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
<<<<<<< HEAD
    document.getElementById('restart')?.addEventListener('click', resetGame);
=======
    
    // Timer
    const timeDisplay = document.querySelector('.stat span:last-child');
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
>>>>>>> 9eddf49d8f79446b5b7f1e0913fc330653a11c2a
});
