FROM python:alpine

RUN mkdir /code

ADD . /code

WORKDIR /code

RUN apk add --no-cache --virtual .bulb-deps \
    g++ \
    && pip3 install -r requirements.txt \
    && apk del .bulb-deps

CMD ["python", "bulbserver.py"]
