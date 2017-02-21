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
        :activeGameId="activeGameId"
        :stoneLocations="stoneLocations"
        @newDelivery="updateStats" 
      />
    </content>
  </div>
</template>

<script>

import Sheet from './Sheet.vue'
import Team from './Team.vue'
import Stats from './Stats.vue'

const BASE_URL = `${location.protocol}//${location.host}`

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
      stoneLocations: []
    }
  },
  methods: {
    getGame(gameId) {
      this.$http.get(`${BASE_URL}/results/${gameId}`).then(response => {
        this.activeGame = response.data
      })
      .catch(err => {
        console.error(err)
      })
    },

    updateStats() {
      this.getGame(this.activeGameId)
    },

    getStones() {
      this.$http.get(`${BASE_URL}/results/stones/${this.activeGameId}`).then(response => {
        this.stoneLocations = response.body
      })
      .catch(err => {
        console.error(err)
      })
    }

  },
  mounted() {
    this.updateStats()
    this.getStones()
  },
  components: {
    Sheet,
    Team,
    Stats
  }
}
</script>
