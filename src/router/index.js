import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views';

Vue.use(VueRouter);

const config = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/input',
    name: 'input',
    component: () => import('@cmp/input/examples'),
  },
  {
    path: '/virtual-list',
    name: 'virtual-list',
    component: () => import('@cmp/virtual-list/examples'),
  },
];

// just for development, if you want to run this project in your local
// please copy a any example and rename it as dev in example/src/views folder
if (process.env.NODE_ENV === 'development') {
  // routes.push({
  //   path: '/dev',
  //   name: 'dev',
  //   component: () => import(/* webpackChunkName: "dev" */ '../views/dev/Main.vue')
  // })
}

const router = new VueRouter({
  // mode: 'history',
  routes: config,
});

export default router;
