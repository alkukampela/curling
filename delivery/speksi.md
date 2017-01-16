# Heittopalvelun toiminta
* Haetaan gamemanagerilta pelin status (esimerkkivastaus alempana).
    * Jos vastauksena tuli http-virhekoodi palautetaan se sellaisenaan
```
{
   "game_id": "b3ad907",
   "team": "team_1",
   "last_stone": false
}    
```
* Validoidaan syöteparametrit (kaikki pakollisia ja kokonaislukuja),
virhetilanteessa palautetaan virhekoodi 400.
    * speed: 0 - 14
    * angle: 0 - 180
    * start_x: -100 - 100
* Kutsutaan GET data-service/stones/{game_id}
* Kutsutaan fysiikkaengineä, tuloksena saadaan kivien sijainti heiton jälkeen
* Kutsutaan POST broadcast/{game_id}
* Jos last_stone = false
    * Kutsutaan POST data-service/stones{game_id}
        * Payloadina fysiikkaengineltä tullut json
    * Kutsutaan POST gamemanager/check_in_delivery/{game_id}
       * Tässä ei tarvita mitään payloadia
* Jos last_stone = true
    * Kutsutaan GET physics/radii
    * Kutsutaan POST scores/calculate_end_score (Payload dokumentin alaosassa)
    * Kutsutaan POST gamemanager/save_end_score/{game_id}
        * Payloadina scoresilta tullut json
    * Kutsutaan DELETE data-service/stones{game_id}


## scores/calculate_end_score:n payload
```
{
	"stones": [
		{"team": "team_1", "x": 201, "y": 799},
		{"team": "team_2", "x": 45, "y": 409},
		{"team": "team_2", "x": 78, "y": 99}
	],
	"radii": {
		"house": 120,
		"stone": 2
	}
}
```
