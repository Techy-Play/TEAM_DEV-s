document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const rollButton = document.getElementById('roll-dice');
    const diceResult = document.querySelector('.roll');
    const positionDisplay = document.querySelector('.position');
    const rollsDisplay = document.querySelector('.stat span:first-child');
    let rolls = 0;
    let currentPosition = 1;
    let isAnimating = false;

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
    function createBoard() {
        board.innerHTML = '';
        const cells = Array(100).fill(null);
        
        // Create cells with correct numbering
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
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
                number = (10 * (9 - row)) + col + 1;
            }
            
            cell.textContent = number;
            cell.setAttribute('data-position', number);
            
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
            }
        }

        dice.style.transition = 'transform 0.1s ease';
        showRandomFace();
    }

    // Update dice face with dots
    function updateDiceFace(number) {
        const diceFace = document.querySelector('.dice-face');
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
        }
    }

    // Move player
    function movePlayer(from, to, isSpecialMove = false) {
        isAnimating = true;
        updatePlayerPosition(from, to);
        currentPosition = to;
        positionDisplay.textContent = to;

        if (to === 100) {
            setTimeout(() => {
                alert('Congratulations! You won! 🎉');
                rollButton.disabled = true;
            }, 500);
        }
    }

    // Handle dice roll
    function rollDice() {
        if (isAnimating) return;
        
        rollButton.disabled = true;
        
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
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .player-token {
            width: 20px;
            height: 20px;
            background: var(--warning-color);
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
    `;
    document.head.appendChild(style);

    // Initialize game
    createBoard();
    updatePlayerPosition(0, 1);
    updateDiceFace(1);
    
    // Event listeners
    rollButton.addEventListener('click', rollDice);
    
    // Timer
    const timeDisplay = document.querySelector('.stat span:last-child');
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
});
