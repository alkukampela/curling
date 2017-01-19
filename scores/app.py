import json
import math
from flask import Flask, request, Response

app = Flask(__name__)

PROP_DISTANCE = 'distance'
PROP_TEAM = 'team'
PROP_RADII = 'radii'


'''
Calculates euclidean distance between two points
'''
def euclidean_distance(point1, point2):
    x1 = point1[0]
    y1 = point1[1]
    x2 = point2[0]
    y2 = point2[1]
    return math.sqrt((x1-y1)**2 + (x2-y2)**2)

'''
@:param stones: List of stones. One stone is in form {team: 1, x: 432, y: 343}
@:param house_radius: diameter of house in pixels
@:param stone_radius: diameter of stones in pixels
@:returns tuple: winning team, points or none if end was draw
'''
def calculate_scores(stones, house_radius, stone_radius):
    max_distance = house_radius + stone_radius
    button_location = [0, 0]

    #Calculate distances
    for stone in stones:
        stone_location = [stone['x'], stone['y']]
        distance = euclidean_distance(stone_location, button_location)
        stone[PROP_DISTANCE] = distance

    stones = [stone for stone in stones if stone[PROP_DISTANCE] <= max_distance]

    if not stones:
        return

    stones = sorted(stones, key=lambda k: k[PROP_DISTANCE])
    closest_stone = stones[0]

    closest_team = closest_stone[PROP_TEAM]

    #Iterate through stones and count score
    points = 1 #1 point for the closest stone
    for stone in stones[1:]:
        # Stone has to belong to the same team and it can't be outside the base
        if stone[PROP_TEAM] == closest_team:
            points += 1
        else:
            break
    return closest_team, points


@app.route('/calculate_end_score', methods=['POST'])
def calculate_end_score():
    request_object = request.get_json()

    stones = request_object['stones']
    house_radius = request_object[PROP_RADII]['house']
    stone_radius = request_object[PROP_RADII]['stone']

    teams = set([stone[PROP_TEAM] for stone in stones])
    results = dict.fromkeys(teams, 0)

    score = calculate_scores(stones, house_radius, stone_radius)

    if score:
        results[score[0]] = score[1]

    return Response(status=200,
                    response=json.dumps(results),
                    mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
