class Game {
    constructor(options) {
        this.mode = options.mode || 'player';
        this.playerNames = options.playerNames || ['Player 1', 'Player 2'];
        this.difficulty = options.difficulty || 'medium';
        this.currentPlayer = 0;
        this.players = [];
        this.board = null;
        this.dice = null;
        this.isGameOver = false;
        this.gameWrapper = document.querySelector('.game-wrapper');
        this.rollCount = 0;
    }

    init() {
        this.board = new Board();
        this.dice = new Dice();
        this.createPlayers();
        this.setupUI();
        this.bindEvents();
        this.updateUI();
        
        // Show the game wrapper
        this.gameWrapper.style.display = 'block';
    }

    createPlayers() {
        if (this.mode === 'bot') {
            this.players = [
                new Player(this.playerNames[0] || 'Player 1', 'player'),
                new Player('Bot', 'bot')
            ];
        } else {
            this.players = [
                new Player(this.playerNames[0] || 'Player 1', 'player'),
                new Player(this.playerNames[1] || 'Player 2', 'player')
            ];
        }
    }

    setupUI() {
        // Use existing board
        const boardContainer = document.getElementById('board');
        if (boardContainer) {
            boardContainer.innerHTML = '';
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

                if (this.board.specialMoves[number]) {
                    cell.classList.add(this.board.specialMoves[number] > number ? 'ladder-start' : 'snake-start');
                }
                
                cells[i] = cell;
            }
            
            cells.forEach(cell => boardContainer.appendChild(cell));
        }

        // Update player turn display
        const playerTurn = document.querySelector('.player-turn span');
        if (playerTurn) {
            playerTurn.textContent = `${this.players[this.currentPlayer].name}'s Turn`;
        }

        // Setup dice face
        const diceFace = document.querySelector('.dice-face');
        if (diceFace) {
            diceFace.innerHTML = this.dice.renderDots(1);
        }
    }

    bindEvents() {
        // Bind roll dice button
        const rollButton = document.getElementById('roll-dice');
        if (rollButton) {
            rollButton.addEventListener('click', () => this.handleRoll());
        }

        // Bind restart button
        const restartButton = document.getElementById('restart');
        if (restartButton) {
            restartButton.addEventListener('click', () => this.resetGame());
        }
    }

    async handleRoll() {
        if (this.isGameOver) return;

        const rollButton = document.getElementById('roll-dice');
        if (rollButton) {
            rollButton.disabled = true;
        }

        const roll = await this.dice.roll();
        const currentPlayer = this.players[this.currentPlayer];
        
        // Update roll display
        const rollDisplay = document.querySelector('.roll');
        if (rollDisplay) {
            rollDisplay.textContent = roll;
        }
        
        // Update roll count
        this.rollCount++;
        const rollsDisplay = document.querySelector('.stat span:first-child');
        if (rollsDisplay) {
            rollsDisplay.textContent = `Rolls: ${this.rollCount}`;
        }

        if (currentPlayer.type === 'bot') {
            setTimeout(() => this.movePlayer(roll), 1000);
        } else {
            this.movePlayer(roll);
        }
    }

    movePlayer(roll) {
        const currentPlayer = this.players[this.currentPlayer];
        const newPosition = currentPlayer.position + roll;

        if (newPosition > 100) {
            this.nextTurn();
            return;
        }

        currentPlayer.moveTo(newPosition);
        this.updatePlayerPosition(currentPlayer);

        // Update position display
        const positionDisplay = document.querySelector('.position');
        if (positionDisplay) {
            positionDisplay.textContent = currentPlayer.position;
        }

        if (newPosition === 100) {
            this.endGame(currentPlayer);
            return;
        }

        const specialMove = this.board.checkSpecialMove(newPosition);
        if (specialMove) {
            setTimeout(() => {
                currentPlayer.moveTo(specialMove);
                this.updatePlayerPosition(currentPlayer);
                
                // Update position display after special move
                if (positionDisplay) {
                    positionDisplay.textContent = currentPlayer.position;
                }
                
                this.nextTurn();
            }, 500);
        } else {
            this.nextTurn();
        }
    }

    updatePlayerPosition(player) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('player');
            cell.classList.remove(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        });
        
        const newCell = document.querySelector(`[data-position="${player.position}"]`);
        if (newCell) {
            newCell.classList.add('player');
            newCell.classList.add(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        }
    }

    nextTurn() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updateUI();

        if (this.players[this.currentPlayer].type === 'bot') {
            setTimeout(() => this.handleRoll(), 1000);
        } else {
            const rollButton = document.getElementById('roll-dice');
            if (rollButton) {
                rollButton.disabled = false;
            }
        }
    }

    endGame(winner) {
        this.isGameOver = true;
        alert(`Congratulations ${winner.name}! You won the game!`);
        
        const rollButton = document.getElementById('roll-dice');
        if (rollButton) {
            rollButton.disabled = true;
        }
    }

    updateUI() {
        // Update player turn display
        const playerTurn = document.querySelector('.player-turn span');
        if (playerTurn) {
            playerTurn.textContent = `${this.players[this.currentPlayer].name}'s Turn`;
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to restart the game?')) {
            this.currentPlayer = 0;
            this.rollCount = 0;
            this.isGameOver = false;
            
            // Reset players
            this.players.forEach(player => {
                player.position = 1;
                this.updatePlayerPosition(player);
            });
            
            // Reset UI
            const rollsDisplay = document.querySelector('.stat span:first-child');
            if (rollsDisplay) {
                rollsDisplay.textContent = 'Rolls: 0';
            }
            
            const positionDisplay = document.querySelector('.position');
            if (positionDisplay) {
                positionDisplay.textContent = '1';
            }
            
            const rollDisplay = document.querySelector('.roll');
            if (rollDisplay) {
                rollDisplay.textContent = '-';
            }
            
            const diceFace = document.querySelector('.dice-face');
            if (diceFace) {
                diceFace.innerHTML = this.dice.renderDots(1);
            }
            
            const rollButton = document.getElementById('roll-dice');
            if (rollButton) {
                rollButton.disabled = false;
            }
            
            this.updateUI();
        }
    }
} 