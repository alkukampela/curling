FROM python:alpine

RUN mkdir /code

ADD . /code

WORKDIR /code

RUN apk add --no-cache --virtual .build-dependencies \
    g++ \
    && pip3 install -r requirements.txt \
    && apk del .build-dependencies
EXPOSE 8127
CMD ["python", "scores.py"]
