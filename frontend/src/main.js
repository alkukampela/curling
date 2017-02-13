import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import App from './App.vue';
import Intro from './components/Intro.vue';
import Game from './components/Game.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  base: __dirname,
  routes: [
    { path: '/', component: Intro },
    { path: '/game/:activeGameId', component: Game, props: true },
  ]
});

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
