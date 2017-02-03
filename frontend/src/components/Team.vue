<template>
  <div class="team">
    <h2 v-bind:class="slug">{{ name }}</h2>
    <!-- <h3>pelaaja</h3> -->
    <div class="deliveries">
      <ul v-bind:class="slug">
        <li v-bind:class="{ active: isDeliveryActive(n) }" v-for="n in stoneCount"></li>
      </ul>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['slug', 'name', 'stoneCount', 'deliveredCount'],
    data() {
      return {};
    },
    methods: {
      isDeliveryActive(count) {
        return count <= this.deliveredCount;
      }
    }
  }
</script>
