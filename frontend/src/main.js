import Vue from 'vue'
import App from './App.vue'

import api from './api';

new Vue({
  el: '#app',
  render: h => h(App)
})

// api usage:
// api.getResults(4).then(game => { console.log(game); });
// api.getActiveGames().then(games => { console.log(games); });
