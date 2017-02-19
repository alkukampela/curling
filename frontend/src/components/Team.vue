<template>
  <div class="team">
    <h2 v:class="slug">{{ name }}</h2>
    <!-- <h3>pelaaja</h3> -->
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
