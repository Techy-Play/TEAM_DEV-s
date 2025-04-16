class GameMenu {
    constructor() {
        this.menuContainer = document.createElement('div');
        this.menuContainer.className = 'menu-container';
        this.currentScreen = 'start';
        this.gameMode = null;
        this.playerName = '';
        this.difficulty = null;
    }

    init() {
        // Set the gold-brown background for menu screens
        document.body.style.backgroundImage = "url('assets/gold-brown-bg.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        
        this.createStartScreen();
        document.body.appendChild(this.menuContainer);
    }

    createStartScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen start-screen">
                <div class="game-logo"></div>
                <h1>Snakes and Ladders</h1>
                <p class="game-tagline">A classic game of luck and strategy!</p>
                <button class="play-btn">
                    <i class="fas fa-play"></i> Play Game
                </button>
            </div>
        `;

        this.menuContainer.querySelector('.play-btn').addEventListener('click', () => {
            this.createGameModeScreen();
        });
    }

    createGameModeScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen game-mode-screen">
                <h2>Select Game Mode</h2>
                <div class="mode-options">
                    <button class="mode-btn" data-mode="bot">
                        <i class="fas fa-robot"></i> Play with Bot
                    </button>
                    <button class="mode-btn" data-mode="player">
                        <i class="fas fa-user-friends"></i> Play with Friend
                    </button>
                </div>
                <button class="back-btn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        `;

        this.menuContainer.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.gameMode = e.target.closest('.mode-btn').dataset.mode;
                if (this.gameMode === 'bot') {
                    this.createDifficultyScreen();
                } else {
                    this.createPlayerNameScreen();
                }
            });
        });
        
        this.menuContainer.querySelector('.back-btn').addEventListener('click', () => {
            this.createStartScreen();
        });
    }

    createPlayerNameScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen player-name-screen">
                <h2>Enter Player Names</h2>
                <div class="player-inputs">
                    <div class="input-group">
                        <label for="player1">Player 1</label>
                        <input type="text" id="player1" placeholder="Enter name" class="player-input">
                    </div>
                    <div class="input-group">
                        <label for="player2">Player 2</label>
                        <input type="text" id="player2" placeholder="Enter name" class="player-input">
                    </div>
                </div>
                <div class="menu-buttons">
                    <button class="back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="continue-btn">
                        <i class="fas fa-arrow-right"></i> Continue
                    </button>
                </div>
            </div>
        `;

        this.menuContainer.querySelector('.continue-btn').addEventListener('click', () => {
            const inputs = this.menuContainer.querySelectorAll('.player-input');
            const player1Name = inputs[0].value.trim() || 'Player 1';
            const player2Name = inputs[1].value.trim() || 'Player 2';

            this.playerNames = [player1Name, player2Name];
            this.createDifficultyScreen();
        });
        
        this.menuContainer.querySelector('.back-btn').addEventListener('click', () => {
            this.createGameModeScreen();
        });
    }

    createDifficultyScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen difficulty-screen">
                <h2>Select Difficulty</h2>
                <div class="difficulty-options">
                    <button class="difficulty-btn" data-difficulty="easy">
                        <i class="fas fa-smile"></i> Easy
                    </button>
                    <button class="difficulty-btn" data-difficulty="medium">
                        <i class="fas fa-meh"></i> Medium
                    </button>
                    <button class="difficulty-btn" data-difficulty="hard">
                        <i class="fas fa-grimace"></i> Hard
                    </button>
                </div>
                <button class="back-btn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        `;

        this.menuContainer.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = e.target.closest('.difficulty-btn').dataset.difficulty;
                this.startGame();
            });
        });
        
        this.menuContainer.querySelector('.back-btn').addEventListener('click', () => {
            if (this.gameMode === 'player') {
                this.createPlayerNameScreen();
            } else {
                this.createGameModeScreen();
            }
        });
    }

    startGame() {
        this.menuContainer.style.display = 'none';
        
        // Reset body background when the game starts
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        
        const game = new Game({
            mode: this.gameMode,
            playerNames: this.playerNames,
            difficulty: this.difficulty,
            menu: this // Pass reference to the menu
        });
        game.init();
    }
} 