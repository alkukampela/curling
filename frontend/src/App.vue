<template>
  <div id="app">
    <heading>
      <div class="team team1">
        <h2>Joukkue</h2>
        <h3>pelaaja</h3>
        <div class="deliveries">
asgasg
        </div>
      </div>

      <div class="scores">
        pisteet
      </div>

      <div class="team team2">
        <h2>Joukkue</h2>
        <h3>pelaaja</h3>
        <div class="deliveries">
asfasf
        </div>
      </div>
    </header>
    <content>
      content
    <div id="ice-surface">
    </div>
    </content>
  </div>
</template>

<script>
import { render } from 'curling-physics/lib/simulation'

import redStone from './assets/stone_red_game.png'
import yellowStone from './assets/stone_yellow_game.png'
import track from './assets/track_cropped.png'

// Sprites for the stones of the different teams
// TODO support other teams than 1 & 2
const sprites = {
  '1': 'src/assets/stone_red_game.png',
  '2': 'src/assets/stone_yellow_game.png',
}
const background = 'src/assets/track_cropped.png'

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
  render(delivery, stones, sprites, background, iceSurface)
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
