<template>
  <div id="ice-surface">
  </div>
</template>

<script>
  import { renderSimulation } from 'curling-physics/lib/simulation'

  import redStone from '../assets/stone_red_game.png'
  import yellowStone from '../assets/stone_yellow_game.png'
  import track from '../assets/track_cropped.png'

  // Sprites for the stones of the different teams
  const sprites = {
    'team_1': 'dist/stone_red_game.png',
    'team_2': 'dist/stone_yellow_game.png',
  }
  const background = 'dist/track_cropped.png'

  export default {
    props: ['activeGameId'],
    data () {
      return {

      }
    },
    methods: {

    },
    mounted() {
      const socket = io.connect('ws://localhost:9999');

      let game_id = this.activeGameId;

      socket.on('connect', function() {
        socket.emit('subscribe', { game_id });
      });

      socket.on('new_delivery', function(data) {
        const iceSurface = document.getElementById('ice-surface')
        const { delivery, stones } = data;
        renderSimulation(delivery, stones, sprites, background, iceSurface);
        //api.getResults(game_id).then(result => console.log(result));
      });
    }
  }
</script>
