import json
import uuid

import requests
from flask import Flask, request, Response, render_template
import jwt


app = Flask(__name__)

SECRET = 'L1hamugi'
ID_LENGTH = 7

RED_TEAM = 'team_1'
YELLOW_TEAM = 'team_2'

STONES_IN_END = 5
TOTAL_ENDS = 4

PROP_GAME_ID = 'game_id'
PROP_TEAMS = 'teams'
PROP_STONES_IN_END = 'stones_in_end'
PROP_TOTAL_ENDS = 'total_ends'
PROP_STONES_THROWN = 'stones_thrown'
PROP_END_SCORES = 'end_scores'


@app.route('/devapi/create')
def create_game():
    game = {}
    game[PROP_GAME_ID] = generate_new_id()
    
    teams = {}
    teams[RED_TEAM] = 'Sorsa-Sepot'
    teams[YELLOW_TEAM] = 'Paha-Kalevit'
    
    game[PROP_TEAMS] = teams
    game[PROP_STONES_IN_END] = STONES_IN_END
    game[PROP_TOTAL_ENDS] = TOTAL_ENDS

    stones_thrown = {}
    stones_thrown[RED_TEAM] = 0
    stones_thrown[YELLOW_TEAM] = 0
    
    game[PROP_STONES_THROWN] = stones_thrown

    game[PROP_END_SCORES] = []



    


    return Response(
        response=json.dumps(game),
        status=200,
        mimetype='text/plain')






@app.route('/encode/<muumio>')
def encode(muumio):
    id = get_new_id()
    data = {'muumio': muumio, 'u': id}
    print(data)
    encoded = jwt.encode(data, SECRET, algorithm='HS256')

    return Response(
        response=encoded,
        status=200,
        mimetype='text/plain')



def generate_new_id():
    return uuid.uuid4().hex[0:ID_LENGTH]



if __name__ == '__main__':
    print('Start')
    app.run(host="0.0.0.0", debug=True)
