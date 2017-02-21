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

  const getIceSurface = () => { return document.getElementById('ice-surface')}

  export default {
    watch: {
      stoneLocations: function(newLocations) {
        renderStationary(newLocations, sprites, background, getIceSurface())
      },
      deliveryEvent: function(newDelivery) {
        renderSimulation(newDelivery.delivery, newDelivery.stones, sprites, background, getIceSurface())
          .then((result) => {
            this.$emit('newDelivery')
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    props: ['stoneLocations', 'deliveryEvent'],
    data() {
      return {}
    },
    methods: {
    },
    mounted() {}
  }
</script>
