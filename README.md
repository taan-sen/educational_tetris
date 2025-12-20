# Educational Tetris Game for Kids 🌊

A fun and interactive typing game built with Angular where players must type falling characters before they hit the rising water level!

## 🎮 Game Features

- **Falling Characters**: Random alphanumeric characters fall from the top with different fonts, colors, and sizes
- **Rising Water**: Animated wavy water that rises when characters hit the surface
- **Confetti Effects**: Colorful confetti burst when characters are successfully popped
- **Progressive Difficulty**: More characters spawn as you progress (max 3 at once)
- **Score System**: Earn 10 points for each character you type correctly
- **Game Over**: When water reaches 100% of the screen

## 🎯 How to Play

1. Click the funky **PLAY** button to start
2. Type the letters/numbers that are falling from the top
3. Successfully typed characters will explode with confetti
4. Prevent characters from hitting the water to avoid raising the water level
5. Game ends when water reaches the top of the screen

## ⚙️ Configuration

Access the configuration popup via the "⚙️ Configure" button:
- **Water Level**: Manually adjust current water level (5-100%)
- **Characters to Top**: Set how many characters need to hit water to reach 100% (2-25)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd funky-play-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## 🛠️ Built With

- **Angular 21** - Frontend framework
- **TypeScript** - Programming language
- **SCSS** - Styling
- **SVG Animations** - Water waves and icons

## 🎨 Features

- **3D Animated Play Button** - Multi-sided button with rotating corners
- **Realistic Water Animation** - Multiple layered SVG waves
- **Responsive Design** - Works on different screen sizes
- **Smooth Animations** - RequestAnimationFrame for 60fps performance
- **Glassmorphism UI** - Modern translucent design elements

## 📱 Controls

- **Keyboard**: Type any alphanumeric character to pop matching falling characters
- **Mouse**: Click buttons and interact with UI elements

## 🏆 Scoring

- **+10 points** per successfully typed character
- **Progressive difficulty** every 10 characters popped
- **Level system** with increasing spawn rates

## 🎯 Game Mechanics

- Characters fall at varying speeds
- Water level increases when characters hit the surface
- All falling characters disappear when one hits the water
- Maximum of 3 characters can spawn simultaneously
- Game automatically stops spawning when water reaches 100%

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting

### Project Structure

```
src/
├── app/
│   ├── app.ts          # Main component logic
│   ├── app.html        # Template
│   ├── app.scss        # Styles
│   └── app.config.ts   # App configuration
├── styles.scss         # Global styles
└── main.ts            # Bootstrap file
```

## 🎮 Game States

1. **Menu Screen**: Shows funky play button with gradient background
2. **Game Screen**: Dark grey background with falling characters and water
3. **Game Over**: Popup showing final score with restart option

## 🌊 Water Physics

- Smooth rising animation (0.5% per frame)
- Three-layer wave system with different speeds
- Realistic wave interference patterns
- Characters stop at water surface

## 🎨 Visual Effects

- **Confetti Burst**: 12 particles per successful hit
- **Character Animations**: Scale and fade effects
- **Water Waves**: Continuous sine wave animations
- **UI Animations**: Bouncing, glowing, and rotating effects

---

Made with ❤️ using Angular
