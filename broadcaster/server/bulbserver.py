import json

from flask import Flask, request, Response, render_template
from flask_socketio import SocketIO, join_room, send

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)

@app.route('/<channel_id>')
def publish(channel_id):
    data = {}
    data['channel_id'] = channel_id
    data['msg'] = request.args.get('msg')
    json_data = json.dumps(data)

    print(f'Publishing: {json_data} to {channel_id}')
    socketio.emit('message', json_data, room=channel_id)
    
    return Response(
        response=json_data,
        status=200,
        mimetype='application/json')


@socketio.on('joined')
def on_join(message):
    channel_id = message['channel_id']
    print(f'Joining: {channel_id}')
    join_room(channel_id)


if __name__ == '__main__':
    print('Start')
    socketio.run(app, host='0.0.0.0')
