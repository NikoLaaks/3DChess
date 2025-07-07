# 3D chess browser game
This project is a 3D chess game built using **Three.js** for rendering 3D objects, **chess.js** for move validation, and **Stockfish** for AI opponent logic.

## Live Demo
Check out the live site here: [https://3d-chess-pi.vercel.app/](https://3d-chess-pi.vercel.app/)

## Features
- Local multiplayer (two players on the same device)
- Single-player mode vs Stockfish engine (20 difficulty levels)
- Full implementation of standard chess rules
- Mouse controls for selecting and moving pieces
- Camera rotates with mouse
- Highlights valid moves for selected pieces
- Selected piece is lifted for better visibility

## Tech stack
- **Javascript**
- **HTML/CSS**
- **WebGL (via Three.js)**
- **Chess.js**
- **Stockfish.js**
- **Vite**

## How to run locally
1. Clone repository
2. cd to folder
3. npm install
4. npm run dev

## Main Files
- **main.js**: Manages UI navigation, game mode initialization, and button clicks to switch between modes and menu views.
- **localMultiplayer.js**: Sets up the local multiplayer game, including 3D scene, board, pieces, game state, and mouse handling for player moves.
- **aiGame.js**: Manages the AI game mode, handling player and AI turns with Stockfish, user interactions, and game state updates.
- **board.js**: Loads and adds the 3D chessboard model to the Three.js scene with proper position and scale.
- **clickHandler.js**: Processes mouse click events to select and move pieces, validates moves with chess.js, and updates game state.
- **movement.js**: Handles piece movement on the board, including captures, castling, promotion, and synchronizing the 3D scene with the game state.
- **pieces.js**: Defines functions and data for creating and managing 3D chess pieces, loading models, positioning, caching, and cloning.
- **scene.js**: Initializes and returns a Three.js scene with camera, renderer, lighting, orbit controls, axes, and responsive resizing.
- **status.js**: Checks game status, determines if the game is over, and displays results in the UI overlay.
- **utils.js**: Utility functions for converting between 3D world coordinates and chessboard notation.
- **settings.js**: Defines the gameSettings object and provides a helper function to toggle settings.
- **landingAnimation.js**: Provides 3D animations for the landing page.

## Todo List
- Lift lamp on scene to be further from table
- Info for main menu buttons
- Different camera options(remove orbit controls, move camera with keyboard)
- Checkbox for piece highlights
- Nav bar fixes, room lighting fixes
- Show selected piece (glow around piece or elevation/animation)
- Nav bar fixes
- Board materials
- Soundeffects
- Loading screen
- Animations for pieces
- Clock(maybe 3D)
- Settings modal
- Instructions/short info to the landing page

## Stockfish.js
- https://github.com/lichess-org/stockfish.js
- https://official-stockfish.github.io/docs/stockfish-wiki/UCI-&-Commands.html
