FROM python:3.6.0-alpine

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code

RUN apk add --no-cache --virtual .build-deps \
    g++ \
    && pip3 install -r requirements.txt \
    && apk del .build-deps

ADD . /code

CMD /usr/local/bin/gunicorn -w 3 --bind 0.0.0.0:5000 app:app
