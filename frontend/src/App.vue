<template>
  <div id="app">
    <heading>
      <div class="team">
        <h2 class="team1">Joukkue</h2>
        <h3 class="team1">pelaaja</h3>
        <div class="deliveries">
          <ul>
            <li class="active"></li>
            <li class="active"></li>
            <li class="active"></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div class="clear"></div>
        </div>
      </div>

      <div class="stats">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th class="played">1</th>
              <th class="played">2</th>
              <th class="played">3</th>
              <th class="active">4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td class="team1">3</td>
              <td>2</td>
              <td class="active">-</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td class="team2">3</td>
              <td class="active">-</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="turns">
          <div class="turn active">1</div>
          <div class="turn team2">1</div>
        </div>
      </div>

      <div class="team">
        <h2 class="team2">Joukkue</h2>
        <h3>pelaaja</h3>
        <div class="deliveries">
          <ul class="team2">
            <li class="active"></li>
            <li class="active"></li>
            <li class="active"></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div class="clear"></div>
        </div>
      </div>
    </heading>
    <content>
      content
    <div id="ice-surface">
    </div>
    </content>
  </div>
</template>

<script>
import { renderSimulation } from 'curling-physics/lib/simulation'

import redStone from './assets/stone_red_game.png'
import yellowStone from './assets/stone_yellow_game.png'
import track from './assets/track_cropped.png'

console.log(redStone)

// Sprites for the stones of the different teams
// TODO support other teams than 1 & 2
const sprites = {
  'team_1': 'dist/stone_red_game.png',
  'team_2': 'dist/stone_yellow_game.png',
}
const background = 'dist/track_cropped.png'

// Parse game id from URL params
const params = new URLSearchParams(window.location.search.slice(1))
const game_id = params.get('game_id')

const socket = io.connect('http://localhost:9999')

socket.on('connect', function() {
  socket.emit('subscribe', { game_id });
});

socket.on('new_delivery', function(data) {
  const iceSurface = document.getElementById('ice-surface')
  const { delivery, stones } = data;
  renderSimulation(delivery, stones, sprites, background, iceSurface)
});

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/sass">

  @import 'assets/scss/_index.scss';


#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

</style>
