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
        this.createStartScreen();
        document.body.appendChild(this.menuContainer);
    }

    createStartScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen start-screen">
                <h1>Snakes and Ladders</h1>
                <button class="play-btn">Play Game</button>
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
                    <button class="mode-btn" data-mode="bot">Play with Bot</button>
                    <button class="mode-btn" data-mode="player">Play with Friend</button>
                </div>
            </div>
        `;

        this.menuContainer.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.gameMode = e.target.dataset.mode;
                if (this.gameMode === 'bot') {
                    this.createDifficultyScreen();
                } else {
                    this.createPlayerNameScreen();
                }
            });
        });
    }

    createPlayerNameScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen player-name-screen">
                <h2>Enter Player Names</h2>
                <div class="player-inputs">
                    <input type="text" placeholder="Player 1 Name" class="player-input">
                    <input type="text" placeholder="Player 2 Name" class="player-input">
                </div>
                <button class="continue-btn">Continue</button>
            </div>
        `;

        this.menuContainer.querySelector('.continue-btn').addEventListener('click', () => {
            const inputs = this.menuContainer.querySelectorAll('.player-input');
            const player1Name = inputs[0].value.trim();
            const player2Name = inputs[1].value.trim();

            if (player1Name && player2Name) {
                this.playerNames = [player1Name, player2Name];
                this.createDifficultyScreen();
            } else {
                alert('Please enter names for both players!');
            }
        });
    }

    createDifficultyScreen() {
        this.menuContainer.innerHTML = `
            <div class="menu-screen difficulty-screen">
                <h2>Select Difficulty</h2>
                <div class="difficulty-options">
                    <button class="difficulty-btn" data-difficulty="easy">Easy</button>
                    <button class="difficulty-btn" data-difficulty="medium">Medium</button>
                    <button class="difficulty-btn" data-difficulty="hard">Hard</button>
                </div>
            </div>
        `;

        this.menuContainer.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = e.target.dataset.difficulty;
                this.startGame();
            });
        });
    }

    startGame() {
        this.menuContainer.style.display = 'none';
        const game = new Game({
            mode: this.gameMode,
            playerNames: this.playerNames,
            difficulty: this.difficulty
        });
        game.init();
    }
} 