class Dice {
    constructor() {
        this.value = 1;
        this.isRolling = false;
    }

    render() {
        return `
            <div class="dice">
                <div class="dice-face">
                    ${this.renderDots(1)}
                </div>
            </div>
        `;
    }

    renderDots(number) {
        const dotPositions = {
            1: [[50, 50]],
            2: [[25, 25], [75, 75]],
            3: [[25, 25], [50, 50], [75, 75]],
            4: [[25, 25], [25, 75], [75, 25], [75, 75]],
            5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
            6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]]
        };

        let dotsHTML = '';
        dotPositions[number].forEach(([x, y]) => {
            dotsHTML += `<span class="dot" style="left: ${x}%; top: ${y}%"></span>`;
        });
        return dotsHTML;
    }

    async roll() {
        if (this.isRolling) return this.value;
        
        this.isRolling = true;
        const dice = document.querySelector('.dice');
        const diceFace = document.querySelector('.dice-face');
        
        if (!diceFace || !dice) {
            this.isRolling = false;
            return 1;
        }
        
        // Add active rolling class for visual feedback
        dice.classList.add('rolling-active');
        
        // Apply rolling animation to the dice
        dice.style.animation = 'rolling 0.8s ease';
        
        // Play dice rolling sound
        this.playRollSound();
        
        // Animate the dots disappearing during roll
        for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            diceFace.innerHTML = this.renderDots(Math.floor(Math.random() * 6) + 1);
        }
        
        // Generate final random number
        this.value = Math.floor(Math.random() * 6) + 1;
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update dice face with final result
        diceFace.innerHTML = this.renderDots(this.value);
        dice.style.animation = '';
        
        // Remove disabled state
        dice.classList.remove('disabled');
        dice.classList.remove('rolling-active');
        
        this.isRolling = false;
        return this.value;
    }
    
    playRollSound() {
        // Create and play dice rolling sound
        try {
            const audio = new Audio();
            audio.src = 'https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3';
            audio.volume = 0.5;
            audio.play();
        } catch (e) {
            console.log('Sound could not be played', e);
        }
    }
} 