import unittest
import scores


class TestScores(unittest.TestCase):
    def test_euclidean(self):
        point1 = [-3, 15]
        point2 = [3, 10]
        expected_distance = 7.81025
        distance = scores.euclidean_distance(point1, point2)
        self.assertEqual(expected_distance, distance)

    def calculate_score_simple(self):
        stones = [{'team': 1, 'x': 201, 'y': 799},
                  {'team': 2, 'x': 45, 'y': 409},
                  {'team': 2, 'x': 78, 'y': 99}]
        house_diameter = 100
        stone_diameter = 30
        team, score = scores.calculate_scores(stones, house_diameter, stone_diameter)

        assertEqual(team, 2)
        assertEqual(score, 2)

if __name__ == '__main__':
    unittest.main()