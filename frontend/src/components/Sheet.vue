<template>
  <div id="ice-surface">
  </div>
</template>

<script>
  import { renderSimulation, renderStationary } from 'curling-physics/lib/simulation'

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
    data() {
      return {};
    },
    mounted() {
      const iceSurface = document.getElementById('ice-surface')
      let game_id = this.activeGameId;

      this.$http.get('http://localhost/results/stones/' + game_id).then(response => {
        renderStationary(response.body, sprites, background, iceSurface)
      })
      .catch(err => {
        console.error(err);
      });

      const socket = io.connect('http://localhost:8888', { path: '/broadcaster/heikin-saapas'});

      socket.on('connect', function() {
        socket.emit('subscribe', { game_id });
      });

      socket.on('new_delivery', (data) => {
        const { delivery, stones } = data;
        renderSimulation(delivery, stones, sprites, background, iceSurface)
          .then((result) => {
            this.$emit('newDelivery', data);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }
</script>
