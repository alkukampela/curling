<template>
  <div class="intro">
    <game-list />

    <a class="info-button" @click="showModal = true">?</a>
    
    <info v-if="showModal" @close="showModal = false">
      <p slot="body">content</p>
    </info>
  </div>
</template>

<script>
  import GameList from './GameList.vue'
  import Info from './Info.vue'

  export default {
    data() {
      return {showModal: false}
    },
    components: {
      GameList,
      Info
    }
  }
</script>
