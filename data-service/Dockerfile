FROM mhart/alpine-node:7.3.0

RUN mkdir /src

WORKDIR /src
ADD package.json /src/package.json
RUN npm install --production

ADD . /src/app

WORKDIR /src/app

ENV NODE_ENV production

EXPOSE 3721

CMD ["npm", "start"]
