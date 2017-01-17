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
import { render } from './simulation'

const socket = io.connect('http://localhost:9999')
const game_id = 'game_1'

socket.on('connect', function() {
  socket.emit('subscribe', { game_id });
});

socket.on('new_delivery', function(data) {
  const iceSurface = document.getElementById('ice-surface')
  while (iceSurface.firstChild) {
    iceSurface.removeChild(iceSurface.firstChild);
  }
  const { stones, delivery } = data;
  render(delivery, stones, document.getElementById('ice-surface'))
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
