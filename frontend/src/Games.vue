<template>
    <div id="app">
        <ul>
            <li v-for="game in games" >
                <a :href="game.game_id">{{game.team_1}} - {{game.team_2}}</a>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
  props: ['games']
}


</script>

<style lang="scss" rel="stylesheet/sass">

  @import 'assets/scss/_index.scss';

</style>
