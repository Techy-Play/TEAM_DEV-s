# TEAM_AMP_DEV-s
This repository is created for the elimination round of GEHU Bhimtal's Hackathon .

# Snakes and Ladders Game

A classic Snakes and Ladders board game implemented with JavaScript, HTML, and CSS. This interactive web-based game features smooth animations, clean user interface, and customizable playing modes.

## 🎮 Game Features

- **Multiple Game Modes _(Still some bugs to figure OUT)_**:
  - Single-player mode against AI bots
  - Multiplayer mode for playing with friends (2-4 players)
  - Difficulty settings (easy, medium, hard) that affect the number of bot players

- **Interactive Elements**:
  - Animated dice rolling
  - Visual representation of snakes and ladders on the board
  - Player tokens with distinct colors
  - Turn notifications
  - Player position tracking

- **User Interface**:
  - Clean, responsive design
  - Game status indicators
  - Player information panels
  - Mobile-friendly layout

## 🎲 How to Play

1. **Start the Game**:
   - Select game mode [ single player or **with friends, Work in progress** ]
   - Enter player names
   - Choose difficulty level (for single player mode)

2. **Gameplay**:
   - Click on the dice to roll
   - Your token automatically moves according to the roll
   - Land on a ladder to climb up
   - Land on a snake to slide down
   - First player to reach position 100 wins

3. **Game Rules**:
   - Players take turns rolling the dice
   - If you land on a ladder, you climb up
   - If you land on a snake, you slide down
   - You must land exactly on 100 to win (excess moves are invalid)

## 🚀 Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/Techy-Play/TEAM_DEV-s.git
   ```

2. Open `index.html` in your browser to play the game.

3. No additional dependencies or installation required!
- ### OR
1. open this [link](https://techy-play.github.io/TEAM_DEV-s/) to play directly
---

## 🧩 Project Structure

- `index.html` - Main game page
- `style.css` - Game styling
- `player-tokens.css` - Token-specific styling
- `Game.js` - Main game logic
- `Board.js` - Board creation and snake/ladder positions
- `Dice.js` - Dice rolling functionality
- `Player.js` - Player entity management
- `menu.js` - Game menu and navigation
- `script.js` - Initialization script
- `LICENSE` - License
- `README.md` - Readme file
- `assets/` - Folder contains all the images used


## 👨‍💻 Contributors and Roles

| Name | Role | Contributions |
|------|------|--------------|
| Lokesh | Lead Developer & UI/UX Designer | Interface design player, styling movement |
| Piyush | Game Mechanics |Game logic implementation, Dice functionality,animations, snake and ladder mechanics |
| Saksham | Testing & QA | Bug fixes, Test game flow optimization |
| Mukesh | Controling Github Repository | Testing and Creating the Documentation |

## 🔧 Technical Implementation

- **Board Generation**: Dynamic board creation with alternating row directions
- **Special Moves**: Snake and ladder positions defined as special moves
- **Player Tokens**: Visual representation of players with colors and animations
- **Turn Management**: System to track current player and handle turn transitions
- **Game State**: Tracking of player positions, dice rolls, and game progress

## 📱 Responsive Design

The game is designed to work on various screen sizes including:
- Desktop computers
- Tablets
- Mobile phones (landscape orientation recommended)

## 🌐 External Resources

- **Fonts**:
  - [Poppins](https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap) - Used for the game interface typography.

- **Icons**:
  - [Font Awesome](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css) - Used for icons in the game controls and UI.

- **Images**:
  - All images used in the game are located in the `assets/` folder. 
  - Images are used from the internet and the site used is [Freepik](https://www.freepik.com/free-photo/).
  - The board image is made using the **javascript (Numbered board) + photoshop (used to add ladders and snakes)** by us.

## 💬 Team Communication

Our team communicated effectively using a **Discord server**. This platform allowed us to collaborate in real-time, share ideas, and coordinate our efforts throughout the development process.

## 🛠️ Tech Stack

The following technologies were used to build the Snakes and Ladders game:

- **HTML**: For structuring the game interface.
- **CSS**: For styling the game elements and ensuring a responsive design.
- **JavaScript**: For implementing game logic, player interactions, and animations.
- **Git & Github**: For version control and collaboration.
- **Discord**: For team communication and coordination.

# 📝 License
#### (non- licensed)

This project is part of GEHU Bhimtal's Hackathon elimination round.



- **Developed by AMP Devs © 2025**

---

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>
