### POST /simulate

Simulate a delivery of a stone towards an array of existing stones.
Responds with an array of the stone locations after the delivery with out-of-bounds
stones removed.

Example request:
```
{
    "delivery": {
        "team": "1",
        "speed": 8,
        "angle": 3,
        "start_x": 7
    },
    "stones": [
        {
            "team": "1",
            "x": 89.2,
            "y": 67.7
        },
        {
            "team": "2",
            "x": 70.0,
            "y": 50.2
        },
        {
            "team": "1",
            "x": 12.2,
            "y": 9.7
        }
    ]
}
```
response:
```
[
    {
        "team": "1",
        "x": 89.2,
        "y": 67.7
    },
    {
        "team": "1",
        "x": 12.2,
        "y": 9.7
    }
]
```
### GET /radii

Get the radii of the stones and the house used by the simulator.

Example response:

```
{
    stone: 10,
    house: 100
}
```