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
    * Kutsutaan POST gamemanager/check_in_delivery/{game_id}
* Jos last_stone = true
    * Kutsutaan GET scores/results
    * Kutsutaan POST gamemanager/save_end_score/{game_id}
    * Kutsutaan DELETE data-service/stones{game_id} (palvelu pitää toteuttaa)
