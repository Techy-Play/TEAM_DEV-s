class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.position = 1;
        this.color = this.generateColor();
    }

    generateColor() {
        const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    moveTo(position) {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }

    isBot() {
        return this.type === 'bot';
    }
} 