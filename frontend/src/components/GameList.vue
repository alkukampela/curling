<template>
  <div class="game-list">
    <ul>
      <li v-for="game in games">
        <a v-on:click="selectGame(game.game_id)">
          <span class="team_1">{{ game.team_1 }}</span> -
          <span class="team_2">{{ game.team_2 }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    methods: {
      updateGames() {
        this.$http.get('http://localhost/results').then(response => {
          this.games = response.data;
        })
        .catch(err => {
          console.error(err);
        });
      },
      selectGame(gameId) {
        this.$emit('setGame', gameId);
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
