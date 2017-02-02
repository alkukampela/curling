<template>
  <div class="stats">
    <table cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <!-- <th class="played">3</th>
          <th class="active">4</th> -->
          <th v-for="n in maxEndCount" v-bind:class="{ active: n === activeEnd, played: n < activeEnd}">
            <span v-if="n <= activeGame.total_ends">{{ n }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- <td class="team_1">3</td> -->
          <td v-for="n in maxEndCount" v-bind:class="{ active: activeEnd === n, team_1: isEndWinner(n, 'team_1')}">
            <span v-if="n < activeEnd">{{ getEndScore(n).team_1 }}</span>
            <div v-else-if="n === activeEnd && hasHammer('team_1')" class="hammer">T</dov>
          </td>
        </tr>
        <tr>
          <!-- <td class="team_2">2</td>
          <td class="active"></td> -->
          <td v-for="n in maxEndCount"  v-bind:class="{ active: activeEnd === n, team_2: isEndWinner(n, 'team_2')}">
            <span v-if="n < activeEnd">{{ getEndScore(n).team_2 }}</span>
            <div v-else-if="n === activeEnd && hasHammer('team_2')" class="hammer">T</div>
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

import R from 'ramda';

export default {
  props: ['activeGame'],
  data () {
    return {
      maxEndCount: 10
    }
  },
  computed: {
    activeEnd() {
      return this.activeGame.end_scores.length + 1;
    }
  },
  methods: {
    hasTeamTurn(teamName){
      return teamName === this.activeGame.delivery_turn;
    },
    getEndScore(endNumber) {
      return this.activeGame.end_scores[endNumber-1];
    },
    sortEndScore(end) {
      return R.sort((a, b) => { a[1] + b[1] }, R.toPairs(end));
    },
    isEndWinner(endNumber, teamName) {
      let endScore = this.getEndScore(endNumber);

      if(!endScore) {
        return false;
      }

      return teamName === R.head(this.sortEndScore(endScore))[0];
    },
    hasHammer(teamName){
      return teamName === this.activeGame.team_with_hammer;
    }
  }
}
</script>
