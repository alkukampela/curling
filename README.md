# curl://ing

## How to play

1. Run ```bash build.sh```
1. Register first team:

    POST http://localhost/games/begin_game?team=Ykkösjengi

    Don't lose the reply, it contains valuable information!
1. Register second team:

    POST http://localhost/games/join_game?team=Kakkosjengi

    This has also very important reply!
1. Go to page linked in team registering reply
1. Curl like there's no tomorrow!


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


## Clear database

```
docker-compose exec redis redis-cli FLUSHALL
```
