# Data-service

## Games

### GET /games/

Returns JSON-array containing all games.

### GET /games/{game_id}

Returns JSON-object containing information about one game.

### POST /games/{game_id}

Adds a new game to storage.

### PUT /games/{game_id}

Updates a game.

## New Game

### POST /newgame/init

Adds a new game to end of new games queue

### POST /newgame/join

Gets and removes first game in the new games queue

## Stones

### GET /stones/{game_id}

Gets stone locations for given game. Returns empty array if no locations could be found.

### POST /stones/{game_id}

Stores stone locations for given game.

### DELETE /stones/{game_id}

Empties stone locations for given game.