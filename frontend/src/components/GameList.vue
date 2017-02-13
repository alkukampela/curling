<template>
  <div class="game-list">
    <ul>
      <li v-for="game in games">
        <router-link :to="{ path: 'game/' + game.game_id }">
          <span class="team_1">{{ game.team_1 }}</span> -
          <span class="team_2">{{ game.team_2 }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  const BASE_URL = `${location.protocol}//${location.host}`

  export default {
    methods: {
      updateGames() {
        this.$http.get(`${BASE_URL}/results`).then(response => {
          this.games = response.data
        })
        .catch(err => {
          console.error(err);
        });
      }
    },
    created() {
      this.updateGames();
    },
    data() {
      return {
        games: []
      };
    }
  }
</script>
