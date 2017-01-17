import json

from flask import Flask, request, Response
from flask_socketio import SocketIO, join_room, send

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)


@app.route('/<game_id>', methods=['POST'])
def publish(game_id):
    socketio.emit('new_delivery', request.json, room=game_id)
    return Response(status=200)


@socketio.on('subscribe')
def on_subscribe(message):
    game_id = message['game_id']
    join_room(game_id)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
