<template>
  <div>
    <header>
      <team
        slug="team_1"
        :name="activeGame.teams.team_1"
        :stoneCount="activeGame.stones_in_end"
        :deliveredCount="activeGame.stones_delivered.team_1"
      />

      <stats :activeGame="activeGame" />

      <team
        slug="team_2"
        :name="activeGame.teams.team_2"
        :stoneCount="activeGame.stones_in_end"
        :deliveredCount="activeGame.stones_delivered.team_2"
      />
    </header>
    <content>
      <sheet
        :stoneLocations="stoneLocations"
        :deliveryEvent="deliveryEvent"
        @newDelivery="refreshScores"
      />
    </content>
   <a class="button info" @click="showModal = true">?</a>
   <info v-if="showModal" @close="showModal = false">
      <div slot="body">
        <h1>Delivery Parameters</h1>
        <p>All parameters accept integers or decimal numbers with a dot (.) as the decimal point.</p>
        <h2>Weight (0...10)</h2>
        <ul>
          <li>0 takes the stone to the hog line.</li>
          <li>~4 takes the stone to the button.</li>
          <li>10 is a heavy delivery</li>
        </ul>
        <h2>Line (degrees)</h2>
        <ul>
          <li>0 is straight to right</li>
          <li>90 is straight to house</li>
          <li>180 is straight to left</li>
        </ul>
        <h2>Curl (-10...10)</h2>
        <ul>
          <li>-10 curls fiercely to the right</li>
          <li>0 does not curl</li>
          <li>10 curls fiercely to the left</li>
        </ul>
      </div>
    </info>
  </div>
</template>

<script>

import * as io from 'socket.io-client'

import Sheet from './Sheet.vue'
import Team from './Team.vue'
import Stats from './Stats.vue'
import Info from './Info.vue'

const BASE_URL = `${location.protocol}//${location.host}`
const WAIT_TIME = 10000

let cleanUpTimeout

export default {
  props: ['activeGameId'],
  data() {
    return {
      activeGame: {
        "teams": {},
        "stones_delivered": {},
        "end_scores": [],
        "total_score": {}
      },
      stoneLocations: [],
      deliveryEvent: {
        "delivery": {},
        "stones": []
      },
      showModal: false
    }
  },
  methods: {
    refreshScores() {
      this.$http.get(`${BASE_URL}/results/${this.activeGameId}`).then(response => {
        this.activeGame = response.data
        if (this.activeGame.stones_delivered.team_1 === 0 &&
            this.activeGame.stones_delivered.team_2 === 0) {
          cleanUpTimeout = setTimeout(() => { this.stoneLocations = [] }, WAIT_TIME)
        }
      })
      .catch(err => {
        console.error(err)
      })

    },

    getStones() {
      this.$http.get(`${BASE_URL}/results/stones/${this.activeGameId}`).then(response => {
        this.stoneLocations = response.body
      })
      .catch(err => {
        console.error(err)
      })
    },

    startSocketListening() {
      const socket = io.connect(BASE_URL, { path: '/deliveries' })
      const game_id = this.activeGameId

      socket.on('connect', function() {
        socket.emit('subscribe', { game_id })
      })

      socket.on('new_delivery', (data) => {
        clearTimeout(cleanUpTimeout)
        this.deliveryEvent = data
      })
    }

  },
  mounted() {
    this.refreshScores()
    this.getStones()
    this.startSocketListening()
  },
  components: {
    Sheet,
    Team,
    Stats,
    Info
  }
}
</script>
