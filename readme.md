
## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
# Todo List
- Chess.js logiikka toimimaan liikutteluun
- tekoäly pelaamaan pelaajaa vastaan
- game loop kuntoon


## extrat myöhemmin
- näytä sallitut liikkeet
- scene siistiksi
- multiplayer
- 

# Game loop

- User Input: Detect when a player selects a piece and attempts to move it.
- Move Validation: Use chess.js to check if the move is legal before applying it.
- Apply Move: If valid, update both chess.js (logic) and Three.js (graphics).
- Check Game State: See if the game has ended (checkmate, stalemate, etc.).
- AI / Opponent Move (if applicable): Handle the opponent’s move (if AI is playing).
- Render Update: Update the Three.js scene.