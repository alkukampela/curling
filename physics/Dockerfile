FROM mhart/alpine-node:7.3.0

RUN mkdir /src

WORKDIR /src
ADD package.json /src/package.json

ADD . /src/app

WORKDIR /src/app
RUN npm install

ENV NODE_ENV development

EXPOSE 3005

CMD ["npm", "start"]
