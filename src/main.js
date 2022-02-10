import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import Corner from './components/Corner.vue';
import './utils';
import './register-global-cmp';
import './style/index.less';

Vue.config.productionTip = false;
// Vue.component(Corner.name, Corner);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
