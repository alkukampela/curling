FROM node:7.5.0-alpine

RUN mkdir /src

WORKDIR /src
ADD package.json /src/package.json
RUN npm install --production

ADD . /src/app

WORKDIR /src/app

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
