<template>
  <div class="intro">
    <game-list v-on:setGame="setGame" />
    {{ activeGame }}
  </div>
</template>

<script>

  import GameList from './GameList.vue';

  export default {
    props: ['activeGame'],
    data() {
      return {};
    },
    methods: {
      setGame(gameId){
        this.$emit('setGame', gameId);
      }
    },
    components: {
      GameList
    }
  }
</script>
