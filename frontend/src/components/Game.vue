<template>
  <div>
    <header>
      <team
        slug="team_1"
        :name="activeGame.teams.team_1"
        :stoneCount="activeGame.stones_in_end"
        :deliveredCount="activeGame.stones_delivered.team_1"
      />
      <div class="stats">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <!-- <th class="played">3</th>
              <th class="active">4</th> -->
              <th v-for="n in 10" v-bind:class="{ active: false}">
                <span v-if="n <= activeGame.total_ends">{{ n }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td class="team_1">3</td>
              <td>0</td>
              <td class="active">H</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>0</td>
              <td>0</td>
              <td class="team_2">2</td>
              <td class="active"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
      <team
        slug="team_2"
        :name="activeGame.teams.team_2"
        :stoneCount="activeGame.stones_in_end"
        :deliveredCount="activeGame.stones_delivered.team_1"
      />
    </header>
    <content>
      <sheet :activeGameId="activeGameId" />
    </content>
  </div>
</template>

<script>
import Sheet from './Sheet.vue';
import Team from './Team.vue';

export default {
  props: ['activeGameId'],
  data () {
    return {
      activeGame: {
        "stones_in_end": 0,
        "total_ends": 0,
        "teams": {
          "team_1": "",
          "team_2": ""
        },
        "stones_delivered": {
          "team_1": 0,
          "team_2": 0
        },
        "end_scores": [],
        "total_score": {
          "team_1": 0,
          "team_2": 0
        },
        "team_with_hammer": "",
        "delivery_turn": ""
      }
    }
  },
  methods: {
    getGame(gameId) {
      this.$http.get('http://localhost/results/' + gameId).then(response => {
        this.activeGame = response.data;
      })
      .catch(err => {
        console.error(err);
      });
    },
    hasTeamTurn(teamName){
      return teamName === this.activeGame.delivery_turn;
    }
  },
  mounted() {
    this.getGame(this.activeGameId);
  },
  components: {
    Sheet,
    Team
  }
}
</script>
