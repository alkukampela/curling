<template>
  <div id="app">
    <intro v-if="!gameInProgress()" v-on:setGame="setGame" />
    <game v-if="gameInProgress()" :activeGameId="activeGame"/>
  </div>
</template>

<script>
  import Intro from './components/Intro.vue';
  import Game from './components/Game.vue';

  export default {
    name: 'app',
    data() {
      return {
        activeGame: null
      };
    },
    methods: {
      setGame(gameId){
        this.activeGame = gameId;
      },
      gameInProgress() {
        return this.activeGame !== null;
      }
    },
    components: {
      Intro,
      Game
    }
  }
  </script>

<style lang="scss" rel="stylesheet/sass">
  @import 'assets/scss/_index.scss';

  #app {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

</style>
