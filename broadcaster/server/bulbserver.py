import json

from flask import Flask, request, Response, render_template
from flask_socketio import SocketIO, join_room, send

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)

@app.route('/<game_id>')
def publish(game_id):
    data = {}
    data['game_id'] = game_id
    data['msg'] = request.args.get('msg')
    json_data = json.dumps(data)

    print(f'Publishing: {json_data} to {game_id}')
    socketio.emit('message', json_data, room=game_id)
    
    return Response(
        response=json_data,
        status=200,
        mimetype='application/json')


@socketio.on('joined')
def on_join(message):
    game_id = message['game_id']
    print(f'Joining: {game_id}')
    join_room(game_id)


if __name__ == '__main__':
    print('Start')
    socketio.run(app, host='0.0.0.0')
