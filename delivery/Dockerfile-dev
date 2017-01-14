FROM mhart/alpine-node:7.3.0

RUN mkdir /src

RUN npm install gulp -g

WORKDIR /src
ADD package.json /src/package.json
RUN npm install

ADD . /src/app

WORKDIR /src/app

ENV NODE_ENV development

EXPOSE 3000

CMD ["gulp"]
