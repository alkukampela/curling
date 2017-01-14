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
PROP_STONES_DELIVERED = 'stones_delivered'
PROP_DELIVERY_TURN = 'delivery_turn'
PROP_END_SCORES = 'end_scores'
PROP_TEAM_WITH_HAMMER = 'team_with_hammer'
PROP_TEAM = 'team'

@app.route('/dev/create')
def create_game():
    game = get_new_game(generate_new_id())

    team_red_jwt = generate_jwt(game[PROP_GAME_ID], RED_TEAM)
    team_yellow_jwt = generate_jwt(game[PROP_GAME_ID], YELLOW_TEAM)
    
    resp = str(json.dumps(game)) + '\n\n\n'
    resp += str(team_red_jwt) + '\n'
    resp += str(team_yellow_jwt) + '\n'

    return Response(
        response=resp,
        status=200,
        mimetype='text/plain')



@app.route('/get_game_status/<jwt_token>')
def get_game_status(jwt_token):
    try:
        response_data = jwt.decode(jwt_token, SECRET, algorithms=['HS256'])
    except:
        return Response(status=400)

    # TODO: call data service
    game = get_new_game(response_data[PROP_GAME_ID])

    
    if response_data[PROP_TEAM] != game[PROP_DELIVERY_TURN]:
        return Response(status=420)
    

    return Response(
        response=json.dumps(response_data),
        status=200,
        mimetype='text/plain')


@app.route('/check_in_delivery/<game_id>', methods=['POST'])
def check_in_delivery(game_id):
    # TODO: call data service
    game = get_new_game(game_id)

    team_that_delivered = game[PROP_DELIVERY_TURN]

    game[PROP_STONES_DELIVERED][team_that_delivered] += 1
    game[PROP_DELIVERY_TURN] = get_other_team(team_that_delivered)

    # TODO call data service

    return Response(status=200, response=json.dumps(game))


def get_new_game(game_id):
    game = {}
    game[PROP_GAME_ID] = game_id
    
    teams = {
        RED_TEAM: 'Sorsa-Sepot',
        YELLOW_TEAM: 'Paha-Kalevit'
    }
    game[PROP_TEAMS] = teams
    game[PROP_STONES_IN_END] = STONES_IN_END
    game[PROP_TOTAL_ENDS] = TOTAL_ENDS

    game[PROP_DELIVERY_TURN] = RED_TEAM
    # Red always starts so yellow has a hammer
    game[PROP_TEAM_WITH_HAMMER] = YELLOW_TEAM

    stones_delivered = {
        RED_TEAM: 0,
        YELLOW_TEAM: 0
    }

    game[PROP_STONES_DELIVERED] = stones_delivered

    game[PROP_END_SCORES] = []
    return game




def get_other_team(team):
    return YELLOW_TEAM if team == RED_TEAM else RED_TEAM


def generate_jwt(game_id, team):
    jwt_content = {}
    jwt_content[PROP_GAME_ID] = game_id
    jwt_content[PROP_TEAM] = team
    return jwt.encode(jwt_content, SECRET, algorithm='HS256')



def generate_new_id():
    return uuid.uuid4().hex[0:ID_LENGTH]



if __name__ == '__main__':
    print('Start')
    app.run(host="0.0.0.0", debug=True)
