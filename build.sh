#!/bin/sh
cd frontend
rm -rf node_modules
npm install
npm run build
cd ..
docker-compose build
docker-compose up