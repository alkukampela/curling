<template>
  <div class="intro">
    <game-list />

    <a class="button info" @click="showModal = true">?</a>

    <info v-if="showModal" @close="showModal = false">
      <div slot="body">
        <h1>How to play?</h1>
        <p>
        You can either start a new game or join game started by your opponent.
        </p>
        <h2>To start a new game</h2>
        <p>
        Send a POST request to <tt>https://curling.goforecrew.com/games/begin?team={team}&amp;stone={stones}&amp;ends={ends}</tt>
        </p>
        <ul>
          <li><b><tt>team</tt></b> name of your team</li>
          <li><tt>stones</tt> number of stones per team in each end, values from 1 to 8, default is 5</li>
          <li><tt>ends</tt> number of ends in game, values from 1 to 10, default is 4</li>
        </ul>

        <h2>To join a game</h2>
        <p>
        To join a game send a POST request to <tt>https://curling.goforecrew.com/games/join?team={team}</tt>
        You'll join the oldest game that hasn't been started yet.
        </p>
        <ul>
          <li><b><tt>team</tt></b> name of your team.</li>
        </ul>
        <h2>To curl</h2>
        <p>
        Reply of your request to begin or join a game will contain all the information that is needed for curling.
        </p>
      </div>
    </info>
  </div>
</template>

<script>
  import GameList from './GameList.vue'
  import Info from './Info.vue'

  export default {
    data() {
      return { showModal: false }
    },
    components: {
      GameList,
      Info
    }
  }
</script>
