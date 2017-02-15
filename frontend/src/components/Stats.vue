<template>
  <div class="stats">
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th v-for="n in maxEndCount" 
              v-bind:class="{ active: n === activeEnd, played: n < activeEnd}">
            <span v-if="n <= activeGame.total_ends">{{ n }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="n in maxEndCount" 
              v-bind:class="{ active: activeEnd === n && !gameIsEnded, team_1: isEndWinner(n, 'team_1')}">
            <span v-if="n < activeEnd">{{ getEndScore(n).team_1 }}</span>
            <div v-else-if="n === activeEnd && hasHammer('team_1') && !gameIsEnded" class="hammer">
              <span class="icon-hammer"></span>
            </div>
          </td>
        </tr>
        <tr>
          <td v-for="n in maxEndCount"  
              v-bind:class="{ active: activeEnd === n && !gameIsEnded, team_2: isEndWinner(n, 'team_2')}">
            <span v-if="n < activeEnd">{{ getEndScore(n).team_2 }}</span>
            <div v-else-if="n === activeEnd && hasHammer('team_2') && !gameIsEnded" class="hammer">
              <span class="icon-hammer"></span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="turns">
      <div class="turn team_1" v-bind:class="{ active: hasTeamTurn('team_1') }">
        {{activeGame.total_score.team_1}}
        <span></span>
      </div>
      <div class="turn team_2" v-bind:class="{ active: hasTeamTurn('team_2') }">
        {{activeGame.total_score.team_2}}
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>

import R from 'ramda'

export default {
  props: ['activeGame'],
  data() {
    return {
      maxEndCount: 10
    }
  },
  computed: {
    activeEnd() {
      return this.activeGame.end_scores.length + 1
    },
    gameIsEnded() {
      return this.activeGame.delivery_turn === 'none'
    }
  },
  methods: {
    hasTeamTurn(teamName) {
      return teamName === this.activeGame.delivery_turn
    },
    getEndScore(endNumber) {
      return this.activeGame.end_scores[endNumber-1]
    },
    isEndWinner(endNumber, teamName) {
      const endScore = this.getEndScore(endNumber)

      if (!endScore) {
        return false
      }
      // Having any points is enough to warrant end win
      return R.gt(endScore[teamName], 0)
    },
    hasHammer(teamName) {
      return teamName === this.activeGame.team_with_hammer
    }
  }
}
</script>
