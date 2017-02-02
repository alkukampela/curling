FROM python:alpine

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code

RUN apk add --no-cache --virtual .build-deps \
    g++ \
    && pip3 install -r requirements.txt \
    && apk del .build-deps

ADD . /code

CMD ["python", "app.py"]
