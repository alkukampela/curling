<template>
  <div class="team">
    <div :class="`${slug}_stat_logo stat_logo`"></div>
    <h2 :class="slug">{{ name }}</h2>
    <div class="deliveries">
      <ul :class="slug">
        <li :class="{ active: isDeliveryActive(n) }" v-for="n in stoneCount"></li>
      </ul>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['slug', 'name', 'stoneCount', 'deliveredCount'],
    data() {
      return {}
    },
    methods: {
      isDeliveryActive(count) {
        return count <= this.deliveredCount
      }
    }
  }
</script>
