# 3D Chess browser game documentation

## Main files
- **main.js**: Manages UI navigation, game mode initialization, handles button clicks to switch between modes and menu views.
- **localMultiplayer.js**: Initializes the local multiplayer game by setting up the 3D scene, board, pieces, game state and mouse click handling for player interactions.
- **aiGame.js**: Initializes and manages game against an AI opponent by setting up 3D scene, handling player and AI turns using Stockfish and processing user interactions and game state updates.
- **board.js**: Loads 3D chessboard model and adds it to the provided Three.js scene with appropriate position and scale.
- **clickHandler.js**: Handles mouse click events, determining if a piece or board square was clicked, managing piece selection and movement, validating moves with chess.js and updating game state.
- **movement.js**: Provides functions to determine pieces square for its 3D position and to handle moving pieces on the board, including updating the 3D scene, managing captures, castling, promotion and synchronizing the game state with chess.js.
- **pieces.js**: Defines functions and data for creating and managing 3D chess pieces in the scene. Loads pieces models, places them at correct position, caches models for reuse and provides utility to clone a cached model for a given color and type.
- **scene.js**: Exports function that initializes and returns a Three.js scene including camera, renderer, lighting, orbit controls, axes and automatic resizing support.
- **status.js**: Exports a function that checks current game status and determines if the game is over, displays the result in a UI overlay if so.
- **utils.js**: Provides functions to convert between 3D world coordinates and chessboard square notation.

## Game flow

1. **Setup**: 
2. **Gameplay**:
3. **Game over**:

## Key functions by file

### main.js
- 

## Important design decisions
- 