FROM python:3.6.0-alpine

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code

RUN apk add --no-cache --virtual .build-deps \
    g++ \
    && pip3 install -r requirements.txt \
    && apk del .build-deps

ADD . /code

EXPOSE 80

CMD ["python", "app.py"]
