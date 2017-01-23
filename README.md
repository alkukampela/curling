# curl://ing

## build frontend

```
cd frontend
npm install
npm run build
```

## dev frontend
```
cd frontend
npm install
npm run dev
```



## How to play

1. Build frontend with npm run build
2. docker-compose build
3. docker-compose up
4. Register first team:
    
    POST http://localhost/gamemanager/begin_game?team=Ykkösjengi

    Don't lose the reply, it contains valuable information!
5. Register second team:
    
    POST http://localhost/gamemanager/join_game?team=Kakkosjengi

    This has also very important reply!
6. Go to http://localhost/results and copy game_id
7. Go to http://localhost:8080/?game_id={game_id}
8. Curl like there's no tomorrow!