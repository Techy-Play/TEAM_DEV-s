document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game menu
    const menu = new GameMenu();
    menu.init();
    
    // Add CSS for dice animation
    const style = document.createElement('style');
    style.textContent = `
        .dice {
            transition: transform 0.3s ease;
            transform-style: preserve-3d;
            perspective: 800px;
        }
        
        .cell.player {
            animation: pulse 1s infinite;
            position: relative;
        }
        
        .cell.player::after {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            background: #8B4513;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 4;
        }
        
        @keyframes pulse {
            0% { transform: scale(1.05); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
});
