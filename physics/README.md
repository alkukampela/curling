```
POST /simulate

request:
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

response:
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


GET /radii
response:
{
    stone: 10,
    house: 100
}
```