import json
import math
from flask import Flask, request, Response, render_template

app = Flask(__name__)
app.debug = True

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
@:param base_diameter: diameter of base in pixels
@:param stone_diameter: diameter of stones in pixels

@:returns scores of both teams
'''
def calculate_scores(stones, base_radius, stone_radius):
    base_location = [0, 0]

    #Calculate distances
    for stone in stones:
        location = [stone('x'), stone('y')]
        distance = euclidean_distance(location, base_location)
        stone['distance'] = distance

    stones_sorted = sorted(stones, key=lambda k: k['distance'])
    closest_stone = stones_sorted[0]
    closest_team = closest_stone['team']

    #Iterate through stones and count score
    current = 1 #1 point for the closest stone
    for stone in stones_sorted[1:]:
        # Stone has to belong to the same team and it can't be outside the base
        if stone['team'] == closest_team and stone['distance'] <= stone_radius + base_radius:
            current += 1
        else:
            break
    return current

@app.route('/')
def hello():
    return "Hello"

@app.route('/results')
def get_results():
    stones = request.args.get('stones')
    base_radius = request.args.get('base_radius')
    stone_radius = request.args.get('stone_radius')

    score = calculate_scores(stones, base_radius, stone_radius)

    json_data = json.dumps(score)

    return Response(
        response=json_data,
        status=200,
        mimetype='application/json')

if __name__ == '__main__':
    print('Start')
    app.run(debug=True, host='localhost', port=8127)