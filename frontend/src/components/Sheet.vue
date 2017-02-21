<template>
  <div id="ice-surface">
  </div>
</template>

<script>
  import { renderSimulation, renderStationary } from 'curling-physics/lib/simulation'
  import * as io from 'socket.io-client'

  import redStone from '../assets/stone_red_game.png'
  import yellowStone from '../assets/stone_yellow_game.png'
  import track from '../assets/track_cropped.png'

  const BASE_URL = `${location.protocol}//${location.host}`

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
      }
    },
    props: ['activeGameId', 'stoneLocations'],
    data() {
      return {}
    },
    methods: {
    },
    mounted() {
      let game_id = this.activeGameId
      const socket = io.connect(BASE_URL, { path: '/deliveries'})

      socket.on('connect', function() {
        socket.emit('subscribe', { game_id })
      })

      socket.on('new_delivery', (data) => {
        const { delivery, stones } = data
        renderSimulation(delivery, stones, sprites, background, getIceSurface())
          .then((result) => {
            this.$emit('newDelivery', data)
          })
          .catch((err) => {
            console.error(err)
          })
      })
    }
  }
</script>
