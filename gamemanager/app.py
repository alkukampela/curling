import json
import uuid
import random
import os

import requests
from flask import Flask, request, Response
from flask_restful import reqparse
import jwt

app = Flask(__name__)

SECRET = 'L1hamugi'
ID_LENGTH = 7

SITE_BASE_URL = os.getenv('SITE_BASE_URL')
DELIVERY_URL = SITE_BASE_URL+'/delivery'
GAME_URL = SITE_BASE_URL+'?game_id='

DATASERVICE_URL = 'http://gateway:8888/data-service/'
GAMES_ENDPOINT = DATASERVICE_URL+'games/'
NEW_GAME_INIT = DATASERVICE_URL+'newgame/init'
NEW_GAME_JOIN = DATASERVICE_URL+'newgame/join'

RED_TEAM = 'team_1'
YELLOW_TEAM = 'team_2'

STONES_IN_END = 5 # Per team
TOTAL_ENDS = 4

PROP_GAME_ID = 'game_id'
PROP_TEAMS = 'teams'
PROP_STONES_IN_END = 'stones_in_end'
PROP_TOTAL_ENDS = 'total_ends'
PROP_STONES_DELIVERED = 'stones_delivered'
PROP_DELIVERY_TURN = 'delivery_turn'
PROP_END_SCORES = 'end_scores'
PROP_TOTAL_SCORE = 'total_score'
PROP_TEAM_WITH_HAMMER = 'team_with_hammer'
PROP_TEAM = 'team'
PROP_LAST_STONE = 'last_stone'
PROP_TEAM_NAME = 'team_name'
PROP_DRAWN_TEAM = 'drawn_team'


@app.route('/begin_game', methods=['POST'])
def begin_game():
    parser = reqparse.RequestParser()
    parser.add_argument('team', help='Name of your team')
    parser.add_argument('ends', default=TOTAL_ENDS, required=False, 
                        type=int, help='Number of ends in game')
    parser.add_argument('stones', default=STONES_IN_END, required=False, 
                        type=int, help='Number of stones in end (per team)')

    args = parser.parse_args()    
    team_name = args['team']
    total_ends = args['ends']
    stones_in_end = args['stones']
    
    if not team_name:
        return Response(status=400,
                        response='Error: Team name cannot be empty.\n')

    if total_ends < 1 or total_ends > 10:
        return Response(status=400,
                        response='Error: Ends to be played must be between 1 and 10.\n')

    if stones_in_end < 1 or stones_in_end > 8:
        return Response(status=400,
                        response='Error: There must be between 1 and 8 stones in each end.\n')

    game_id = generate_new_id()
    new_game = {
        PROP_GAME_ID: game_id,
        PROP_TEAM_NAME: team_name,
        PROP_DRAWN_TEAM: draw_a_team(),
        PROP_TOTAL_ENDS: total_ends,
        PROP_STONES_IN_END: stones_in_end
    }
    
    response = requests.post(f'{NEW_GAME_INIT}', json = new_game)
    if (response.status_code != 201):
        return Response(status=500,
                        response='Error during game initialization.\n')

    jwt_token = generate_jwt(game_id, new_game[PROP_DRAWN_TEAM])

    instructions = get_new_game_instructions(new_game[PROP_TOTAL_ENDS], 
                                             new_game[PROP_STONES_IN_END], 
                                             new_game[PROP_DRAWN_TEAM])

    instructions += get_delivery_instructions(jwt_token.decode('UTF-8'), game_id)

    print(json.dumps(new_game))
    return Response(status=200,
                    response=instructions,
                    mimetype='text/plain')


@app.route('/join_game', methods=['POST'])
def join_game():
    parser = reqparse.RequestParser()
    parser.add_argument('team', help='Name of your team')

    args = parser.parse_args()    
    team_name = args['team']

    if not team_name:
        return Response(status=400,
                        response='Error: Team name cannot be empty.\n')

    new_game = requests.post(f'{NEW_GAME_JOIN}').json()

    if not new_game:
        return Response(status=400,
                        response='Error: No game to join.\n')

    game_id = new_game[PROP_GAME_ID]
    joined_team = get_other_team(new_game[PROP_DRAWN_TEAM])

    teams = get_teams(new_game[PROP_DRAWN_TEAM],
                      new_game[PROP_TEAM_NAME],
                      team_name)
    
    game = init_new_game(game_id,
                         teams,
                         new_game[PROP_STONES_IN_END],
                         new_game[PROP_TOTAL_ENDS])

    create_game_in_dataservice(game_id, game)

    instructions = get_joined_game_instructions(new_game[PROP_TOTAL_ENDS], 
                                                new_game[PROP_STONES_IN_END], 
                                                joined_team)

    jwt_token = generate_jwt(game_id, joined_team)
    instructions += get_delivery_instructions(jwt_token.decode('UTF-8'), game_id)

    return Response(status=200,
                    response=instructions,
                    mimetype='text/plain')


@app.route('/game_status/<jwt_token>')
def get_game_status(jwt_token):
    try:
        response_data = jwt.decode(jwt_token, SECRET, algorithms=['HS256'])
    except:
        return Response(status=400)

    game = get_game_from_dataservice(response_data[PROP_GAME_ID])

    if not game:
        return Response(status=404,
                        response='{"error": "Invalid game"}',
                        mimetype='application/json')

    if response_data[PROP_TEAM] != game[PROP_DELIVERY_TURN]:
        return Response(status=420,
                        response='{"error": "Other team has the turn"}',
                        mimetype='application/json')
    
    response_data[PROP_LAST_STONE] = check_for_last_stone(
        game[PROP_STONES_DELIVERED], game[PROP_STONES_IN_END])

    return Response(status=200,
                    response=json.dumps(response_data),
                    mimetype='application/json')


@app.route('/check_in_delivery/<game_id>', methods=['POST'])
def check_in_delivery(game_id):
    game = get_game_from_dataservice(game_id)

    team_that_delivered = game[PROP_DELIVERY_TURN]

    game[PROP_STONES_DELIVERED][team_that_delivered] += 1
    game[PROP_DELIVERY_TURN] = get_other_team(team_that_delivered)

    update_game_in_dataservice(game_id, game)

    return Response(status=200, 
                    response=json.dumps(game),
                    mimetype='application/json')


@app.route('/end_score/<game_id>', methods=['POST'])
def save_end_score(game_id):
    end_score = request.get_json()
    end_score.setdefault(RED_TEAM, 0)
    end_score.setdefault(YELLOW_TEAM, 0)

    game = get_game_from_dataservice(game_id)

    game[PROP_END_SCORES].append(end_score)
    game[PROP_TOTAL_SCORE][RED_TEAM] += end_score[RED_TEAM]
    game[PROP_TOTAL_SCORE][YELLOW_TEAM] += end_score[YELLOW_TEAM]

    # Reset delivery counter
    game[PROP_STONES_DELIVERED][RED_TEAM] = 0
    game[PROP_STONES_DELIVERED][YELLOW_TEAM] = 0
    
    # Check team that has last stone advantage
    game[PROP_TEAM_WITH_HAMMER] = get_team_with_hammer(
                                        game[PROP_TEAM_WITH_HAMMER], 
                                        end_score)

    # Set team that has next delivery turn
    # Note: this will be no-one when game is ended
    game[PROP_DELIVERY_TURN] = get_team_with_first_delivery_turn(game)

    update_game_in_dataservice(game_id, game)

    return Response(status=200)


def init_new_game(game_id, teams, stones_in_end, total_ends):
    game = {}
    game[PROP_GAME_ID] = game_id
    
    game[PROP_TEAMS] = teams
    game[PROP_STONES_IN_END] = stones_in_end
    game[PROP_TOTAL_ENDS] = total_ends

    # Red always starts so yellow has a hammer
    game[PROP_DELIVERY_TURN] = RED_TEAM
    game[PROP_TEAM_WITH_HAMMER] = YELLOW_TEAM

    game[PROP_STONES_DELIVERED] = {
        RED_TEAM: 0,
        YELLOW_TEAM: 0
    }

    game[PROP_END_SCORES] = []
    game[PROP_TOTAL_SCORE] = {
        RED_TEAM: 0,
        YELLOW_TEAM: 0
    }

    return game

def get_other_team(team):
    return YELLOW_TEAM if team == RED_TEAM else RED_TEAM

def get_team_with_hammer(current_holder, end_scores):
    if end_scores[RED_TEAM] == end_scores[YELLOW_TEAM]:
        return current_holder
    if end_scores[YELLOW_TEAM] > end_scores[RED_TEAM]:
        return RED_TEAM
    return YELLOW_TEAM

def get_team_with_first_delivery_turn(game):
    if (game[PROP_TOTAL_ENDS] <= len(game[PROP_END_SCORES]) and
        game[PROP_TOTAL_SCORE][RED_TEAM] != game[PROP_TOTAL_SCORE][YELLOW_TEAM]):
        return 'none'
    return get_other_team(game[PROP_TEAM_WITH_HAMMER])

def check_for_last_stone(stones_delivered, stones_in_end):
    stones_thrown = stones_delivered[RED_TEAM] + stones_delivered[YELLOW_TEAM]
    return stones_thrown + 1 >= stones_in_end * 2

def generate_jwt(game_id, team):
    jwt_content = {}
    jwt_content[PROP_GAME_ID] = game_id
    jwt_content[PROP_TEAM] = team
    return jwt.encode(jwt_content, SECRET, algorithm='HS256')

def generate_new_id():
    return uuid.uuid4().hex[0:ID_LENGTH]

def get_game_from_dataservice(game_id):
    response = requests.get(f'{GAMES_ENDPOINT}{game_id}')
    return response.json()

def create_game_in_dataservice(game_id, game):
    response = requests.post(f'{GAMES_ENDPOINT}{game_id}', json = game)

def update_game_in_dataservice(game_id, game):
    response = requests.put(f'{GAMES_ENDPOINT}{game_id}', json = game)

def draw_a_team():
    return YELLOW_TEAM if random.randint(0, 1) else RED_TEAM

def get_teams(drawn_team, init_team, join_team):
    if drawn_team == YELLOW_TEAM:
        return {
            RED_TEAM: join_team,
            YELLOW_TEAM: init_team
        }
    else:
        return {
            RED_TEAM: init_team,
            YELLOW_TEAM: join_team
        }

def get_new_game_instructions(total_ends, stones_in_end, team):
    return f'''
Hello and welcome to the amazing world of Curling!

A new game was initialized with {total_ends} ends having {stones_in_end} stones in each.
{get_team_instructions(team)}
The game can start when your opponent joins the game.
'''

def get_joined_game_instructions(total_ends, stones_in_end, team):
    return f'''
Hello and welcome to the amazing world of Curling!

You are participating in a game with {total_ends} ends having {stones_in_end} stones in each.
{get_team_instructions(team)}
'''

def get_team_instructions(team):
    if (team == RED_TEAM):
        return 'You\'ll be playing with red stones and you have the first turn.'
    else:
        return 'You\'ll be playing with yellow stones and you have the second turn.'

def get_delivery_instructions(jwt_token, game_id):
    return f'''    
Usage (replace zeroes with suitable values):
curl -X PUT -H "Authorization: Bearer {jwt_token}" "{DELIVERY_URL}?speed=0&angle=0&curl=0"

To watch the game, go to {GAME_URL}{game_id}

'''

if __name__ == '__main__':
    DEBUGMODE = bool(os.getenv('DEBUGMODE'))
    app.run(host='0.0.0.0', debug=DEBUGMODE)
