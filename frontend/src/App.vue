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
    </content>
  </div>
</template>

<script>
import { render } from './simulation'

// TODO receive this via websocket and render
const { stones, delivery } = {
  "delivery": {
    "team": "1",
    "speed": 10,
    "angle": 90,
    "start_x": 5
  },
  "stones": [
    {
      "team": "2",
      "x": 0,
      "y": 100
    },
    {
      "team": "1",
      "x": -30,
      "y": 80
    },
    {
      "team": "1",
      "x": -30,
      "y": 0
    }
  ]
}

render(delivery, stones, document.body)

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
