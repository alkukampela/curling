FROM mhart/alpine-node:7.3.0

RUN mkdir /app

WORKDIR /app
ADD package.json /app/package.json
RUN npm install

ADD . /app

WORKDIR /app

ENV NODE_ENV development

EXPOSE 3005

CMD ["npm", "start"]
