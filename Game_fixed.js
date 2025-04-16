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
        this.menu = options.menu; // Reference to the menu
        this.playerStats = []; // Track stats for each player
    }

    init() {
        this.board = new Board();
        this.dice = new Dice();
        this.createPlayers();
        this.setupUI();
        this.bindEvents();
        this.updateUI();
        this.updateAllPlayerTokens();
        
        // Show the game wrapper
        this.gameWrapper.style.display = 'block';

        // Initialize player stats
        this.players.forEach(player => {
            this.playerStats.push({
                name: player.name,
                position: 1,
                lastRoll: 0
            });
        });

        // Create player info panel
        this.createPlayerInfoPanel();
        
        // Announce the first player's turn
        if (this.players[0].type !== 'bot') {
            this.showTurnNotification(this.players[0].name);
        }
        
        // Emergency fix for player token visibility
        this.fixPlayerTokenVisibility();
        
        // Set interval to periodically check and fix player token visibility
        this.visibilityCheckInterval = setInterval(() => {
            this.fixPlayerTokenVisibility();
        }, 2000);
    }

    createPlayers() {
        // Clear existing players
        this.players = [];
        
        if (this.mode === 'single') {
            // Create human player (always first in single player mode)
            this.players.push(new Player(this.playerNames[0] || 'Player', 'human'));
            
            // Create bot players based on selected difficulty
            const botCount = this.difficulty === 'easy' ? 1 : 
                            this.difficulty === 'medium' ? 2 : 3;
            
            for (let i = 0; i < botCount; i++) {
                this.players.push(new Player(`Bot ${i+1}`, 'bot'));
            }
        } else if (this.mode === 'friend') {
            // In friend mode, create only human players (2-4)
            // Get valid player names (non-empty)
            const validNames = this.playerNames.filter(name => name && name.trim());
            const playerCount = Math.min(Math.max(validNames.length, 2), 4);
            
            for (let i = 0; i < playerCount; i++) {
                const name = validNames[i] || `Player ${i+1}`;
                // Explicitly set type to 'human' for all players in friend mode
                this.players.push(new Player(name, 'human'));
            }
        }
        
        // Randomize player order for fairness
        this.players = this.players.sort(() => Math.random() - 0.5);
        
        // Reset current player
        this.currentPlayer = 0;
        
        // Update player indicators
        this.updatePlayerIndicators();
    }

    createPlayerInfoPanel() {
        const gameInfo = document.querySelector('.game-info');
        if (!gameInfo) return;

        // Clear existing player info
        const existingPanel = document.querySelector('.player-info-panel');
        if (existingPanel) existingPanel.remove();

        // Create new player info panel
        const playerInfoPanel = document.createElement('div');
        playerInfoPanel.className = 'player-info-panel';
        
        this.players.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = `player-card ${index === this.currentPlayer ? 'active' : ''}`;
            playerCard.style.borderColor = player.color;
            
            playerCard.innerHTML = `
                <div class="player-card-header" style="background-color: ${player.color}">
                    <span class="player-name">${player.name}</span>
                    ${index === this.currentPlayer ? '<span class="current-turn-badge">Current Turn</span>' : ''}
                </div>
                <div class="player-card-body">
                    <div class="player-stat">
                        <span class="stat-label">Position:</span>
                        <span class="stat-value position-value">${player.position}</span>
                    </div>
                    <div class="player-stat">
                        <span class="stat-label">Last Roll:</span>
                        <span class="stat-value roll-value">${this.playerStats[index]?.lastRoll || '-'}</span>
                    </div>
                </div>
            `;
            
            playerInfoPanel.appendChild(playerCard);
        });
        
        gameInfo.appendChild(playerInfoPanel);
        
        // Create simplified status display next to dice
        this.createSimplifiedStatusDisplay();
    }
    
    createSimplifiedStatusDisplay() {
        const diceContainer = document.querySelector('.dice-container');
        if (!diceContainer) return;
        
        // Remove existing status display if it exists
        const existingStatus = document.querySelector('.player-status-display');
        if (existingStatus) existingStatus.remove();
        
        const currentPlayer = this.players[this.currentPlayer];
        
        // Create new status display
        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'player-status-display';
        
        statusDisplay.innerHTML = `
            <div class="player-turn-indicator" style="background-color: ${currentPlayer.color}">
                <div class="player-avatar">
                    <span>P</span>
                </div>
                <span class="player-turn-name">${currentPlayer.name}'s Turn</span>
            </div>
            <div class="status-cards">
                <div class="status-card position-card">
                    <h3>Current Position</h3>
                    <div class="status-value">${currentPlayer.position}</div>
                </div>
                <div class="status-card roll-card">
                    <h3>Last Roll</h3>
                    <div class="status-value">${this.playerStats[this.currentPlayer]?.lastRoll || '-'}</div>
                </div>
            </div>
        `;
        
        diceContainer.insertBefore(statusDisplay, diceContainer.firstChild);
        
        // Emergency fix for player visibility
        this.fixPlayerTokenVisibility();
    }
    
    // Update token visibility on each cell
    fixPlayerTokenVisibility() {
        // Update token visibility on each cell
        
        // First, remove all existing tokens
        document.querySelectorAll('.player-token').forEach(token => token.remove());
        
        // Create tokens for each player and add them to their respective cells
        this.players.forEach((player, index) => {
            const position = player.getPosition();
            
            // Only add tokens for positions 1-100
            if (position >= 1 && position <= 100) {
                const cell = document.querySelector(`.cell[data-position="${position}"]`);
                if (!cell) return;
                
                // Configure the cell to properly handle tokens
                cell.style.position = 'relative';
                cell.style.overflow = 'visible';
                
                // Create a token for this player
                const token = document.createElement('div');
                token.className = 'player-token';
                token.dataset.player = index;
                
                // Calculate offset to prevent tokens from overlapping
                // Find other players on the same cell
                const playersOnSameCell = this.players.filter(p => 
                    p.getPosition() === position && p !== player
                ).length;
                
                // Distribute tokens evenly within the cell
                const offsetX = (playersOnSameCell > 0) ? 
                    (index % 2 === 0 ? -10 : 10) : 0;
                const offsetY = (playersOnSameCell > 0) ? 
                    (index < 2 ? -10 : 10) : 0;
                
                // Set token style
                token.style.position = 'absolute';
                token.style.top = `calc(50% - 10px + ${offsetY}px)`;
                token.style.left = `calc(50% - 10px + ${offsetX}px)`;
                token.style.width = '20px';
                token.style.height = '20px';
                token.style.borderRadius = '50%';
                token.style.backgroundColor = player.color;
                token.style.border = '2px solid white';
                token.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                token.style.zIndex = '10';
                
                // Add pulsing animation for current player
                if (index === this.currentPlayer) {
                    token.style.animation = 'pulse 1s infinite alternate';
                }
                
                // Add token to the cell
                cell.appendChild(token);
            }
        });
    }

    updatePlayerInfoPanel() {
        const playerCards = document.querySelectorAll('.player-card');
        playerCards.forEach((card, index) => {
            const positionValue = card.querySelector('.position-value');
            const rollValue = card.querySelector('.roll-value');
            
            if (positionValue) {
                positionValue.textContent = this.players[index].position;
            }
            
            if (rollValue) {
                rollValue.textContent = this.playerStats[index].lastRoll || '-';
            }
        });
        
        // Update simplified status display as well
        this.updateSimplifiedStatusDisplay();
    }
    
    updateSimplifiedStatusDisplay() {
        const statusDisplay = document.querySelector('.player-status-display');
        if (!statusDisplay) return;
        
        const currentPlayer = this.players[this.currentPlayer];
        
        // Update player name and color
        const turnIndicator = statusDisplay.querySelector('.player-turn-indicator');
        const playerAvatar = statusDisplay.querySelector('.player-avatar');
        const playerTurnName = statusDisplay.querySelector('.player-turn-name');
        
        if (turnIndicator) turnIndicator.style.backgroundColor = currentPlayer.color;
        if (playerAvatar) {
            playerAvatar.innerHTML = '<span>P</span>';
        }
        if (playerTurnName) playerTurnName.textContent = `${currentPlayer.name}'s Turn`;
        
        // Update position and roll values
        const positionValue = statusDisplay.querySelector('.position-card .status-value');
        const rollValue = statusDisplay.querySelector('.roll-card .status-value');
        
        if (positionValue) positionValue.textContent = currentPlayer.position;
        if (rollValue) rollValue.textContent = this.playerStats[this.currentPlayer]?.lastRoll || '-';
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
            playerTurn.style.color = this.players[this.currentPlayer].color;
            playerTurn.style.fontWeight = 'bold';
        }

        // Setup dice face
        const diceFace = document.querySelector('.dice-face');
        if (diceFace) {
            diceFace.innerHTML = this.dice.renderDots(1);
        }
        
        // Restructure the game controls to put status cards on the left of dice
        const gameControls = document.querySelector('.game-controls');
        if (gameControls) {
            gameControls.classList.add('game-controls-flex');
            
            // Hide Roll Dice button as we'll make the dice clickable
            const rollButton = document.getElementById('roll-dice');
            if (rollButton) {
                rollButton.style.display = 'none';
            }
            
            // Add a click hint to the dice
            const diceContainer = document.querySelector('.dice-container');
            if (diceContainer) {
                const clickHint = document.createElement('div');
                clickHint.className = 'dice-click-hint';
                clickHint.textContent = 'Click to roll';
                diceContainer.appendChild(clickHint);
            }
        }
    }

    bindEvents() {
        // Make dice clickable
        const dice = document.querySelector('.dice');
        if (dice) {
            dice.classList.add('clickable');
            dice.addEventListener('click', () => this.handleRoll());
        }

        // Bind restart button
        const restartButton = document.getElementById('restart');
        if (restartButton) {
            restartButton.addEventListener('click', () => this.resetGame());
        }

        // Bind home button
        const homeButton = document.getElementById('home');
        if (homeButton) {
            homeButton.addEventListener('click', () => this.goHome());
        }
    }

    goHome() {
        if (confirm('Are you sure you want to return to the home screen? Your current game progress will be lost.')) {
            // Hide game wrapper
            this.gameWrapper.style.display = 'none';
            
            // Restart the menu
            if (this.menu) {
                this.menu.menuContainer.style.display = 'flex';
                this.menu.createStartScreen();
            } else {
                // Create a new menu if reference doesn't exist
                const menu = new GameMenu();
                menu.init();
            }
        }
    }

    async handleRoll() {
        if (this.isGameOver || this.dice.isRolling) return;

        const dice = document.querySelector('.dice');
        if (dice) {
            dice.classList.add('disabled');
        }

        const roll = await this.dice.roll();
        const currentPlayer = this.players[this.currentPlayer];
        
        // Update player stats
        this.playerStats[this.currentPlayer].lastRoll = roll;
        
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

        // Process the player's move, with the same timing for both bot and human players
        setTimeout(() => this.movePlayer(roll), 500);
    }

    updatePlayerPosition(player) {
        const cells = document.querySelectorAll('.cell');
        
        // Only remove this specific player's class
        cells.forEach(cell => {
            cell.classList.remove(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        });
        
        const newCell = document.querySelector(`[data-position="${player.position}"]`);
        if (newCell) {
            newCell.classList.add(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        }
        
        // Update all player tokens display with a refreshed view
        this.updateAllPlayerTokens();
    }
    
    updateAllPlayerTokens() {
        this.fixPlayerTokenVisibility();
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
        
        // Update player stats
        this.playerStats[this.currentPlayer].position = currentPlayer.position;

        // Update position display
        const positionDisplay = document.querySelector('.position');
        if (positionDisplay) {
            positionDisplay.textContent = currentPlayer.position;
        }

        // Update player info panel
        this.updatePlayerInfoPanel();
        
        // Fix player token visibility after position change
        this.fixPlayerTokenVisibility();

        if (newPosition === 100) {
            this.endGame(currentPlayer);
            return;
        }

        const specialMove = this.board.checkSpecialMove(newPosition);
        if (specialMove) {
            setTimeout(() => {
                currentPlayer.moveTo(specialMove);
                this.updatePlayerPosition(currentPlayer);
                
                // Update player stats again after special move
                this.playerStats[this.currentPlayer].position = currentPlayer.position;
                
                // Update position display after special move
                if (positionDisplay) {
                    positionDisplay.textContent = currentPlayer.position;
                }
                
                // Update player info panel again
                this.updatePlayerInfoPanel();
                
                // Fix player token visibility after special move
                this.fixPlayerTokenVisibility();
                
                this.nextTurn();
            }, 500);
        } else {
            this.nextTurn();
        }
    }

    nextTurn() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updateUI();
        
        // Update all player tokens to reflect new current player
        this.updateAllPlayerTokens();

        // Update player cards to show current turn
        const playerCards = document.querySelectorAll('.player-card');
        playerCards.forEach((card, index) => {
            card.classList.remove('active');
            const badge = card.querySelector('.current-turn-badge');
            if (badge) badge.remove();
            
            if (index === this.currentPlayer) {
                card.classList.add('active');
                const header = card.querySelector('.player-card-header');
                if (header) {
                    const badge = document.createElement('span');
                    badge.className = 'current-turn-badge';
                    badge.textContent = 'Current Turn';
                    header.appendChild(badge);
                }
            }
        });
        
        // Update simplified status display for new player
        this.updateSimplifiedStatusDisplay();

        // Only auto-roll for bot players
        if (this.players[this.currentPlayer].type === 'bot') {
            setTimeout(() => this.handleRoll(), 1000);
        } else {
            // For human players, just enable the dice
            const dice = document.querySelector('.dice');
            if (dice) {
                dice.classList.remove('disabled');
            }
            
            // Show whose turn it is with a toast message
            this.showTurnNotification(this.players[this.currentPlayer].name);
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
            playerTurn.style.color = this.players[this.currentPlayer].color;
            playerTurn.style.fontWeight = 'bold';
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to restart the game?')) {
            this.currentPlayer = 0;
            this.rollCount = 0;
            this.isGameOver = false;
            
            // Reset players
            this.players.forEach((player, index) => {
                player.position = 1;
                
                // Reset player stats
                this.playerStats[index] = {
                    name: player.name,
                    position: 1,
                    lastRoll: 0
                };
            });
            
            // Update all player tokens
            this.updateAllPlayerTokens();
            
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
            
            const dice = document.querySelector('.dice');
            if (dice) {
                dice.classList.remove('disabled');
            }
            
            // Update player info panel
            this.createPlayerInfoPanel();
            
            this.updateUI();
        }
    }

    // Add a visual notification when it's a player's turn
    showTurnNotification(playerName) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.turn-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'turn-notification';
        notification.textContent = `${playerName}'s Turn`;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        }, 10);
    }
} 
