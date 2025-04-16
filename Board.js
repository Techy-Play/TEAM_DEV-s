class Board {
    constructor() {
        // Snake and Ladder positions
        this.specialMoves = {
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
    }

    render() {
        const boardContainer = document.createElement('div');
        boardContainer.id = 'board';
        boardContainer.className = 'board';
        
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

            if (this.specialMoves[number]) {
                cell.classList.add(this.specialMoves[number] > number ? 'ladder-start' : 'snake-start');
            }
            
            cells[i] = cell;
        }
        
        cells.forEach(cell => boardContainer.appendChild(cell));
        return boardContainer.outerHTML;
    }

    updatePlayerPosition(player) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        });
        
        const newCell = document.querySelector(`[data-position="${player.position}"]`);
        if (newCell) {
            newCell.classList.add(`player-${player.name.replace(/\s+/g, '-').toLowerCase()}`);
        }
    }

    checkSpecialMove(position) {
        return this.specialMoves[position] || null;
    }
} 