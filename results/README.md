# Results service

## Get /resuts/

Example result:

```json
[
    {
        "game_id":"dc40f98",
        "team_1":"Helppo-Heikit",
        "team_2":"Luutijat"
    }
],
[
    {
        "game_id":"a0fi212",
        "team_1":"Mercurials",
        "team_2":"Erikois-Team"
    }
]
```

## Get /results/{game_id}

Example result:

```json
{
    "stones_in_end":5,
    "total_ends":4,
    "game_id":"dc40f98",
    "team_with_hammer":"team_1",
    "delivery_turn":"team_1",
    "teams":
    {
        "team_1":"Luuta-Sport",
        "team_2":"Viktiga Grabbarna"
    },
    "stones_delivered":
    {
        "team_1":0,
        "team_2":1
    },
    "end_scores":[
        {
            "team_1":3,
            "team_2":0
        },
        {
            "team_1":0,
            "team_2":1
        }
    ],
    "total_score":
    {
        "team_1":3,
        "team_2":1
    }
}
```
