import Vue from 'vue'
import Games from './Games.vue'

import api from './api';

/*
let active_games = [
  {
    "game_id": "fff",
    "team_1": "Ykkösjengi",
    "team_2": "Kakkosjengi"
  },
  {
    "game_id": "eee",
    "team_1": "Me",
    "team_2": "Viholliset"
  }
]
*/
//let g = api.getActiveGames()

let active_games = api.getActiveGames()



var vcomponent = new Vue({
  el: '#app',
  render: h => h(Games, { 
    props: { 
      games: []
    }
  }),
  mounted: function() {
    console.log('***')
    console.log(this)
    this.props.games = api.getActiveGames()
    console.log(self.props)
  }
})

