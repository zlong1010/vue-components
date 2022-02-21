import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views';

Vue.use(VueRouter);

const requireRoutes = require.context('/components', true, /index\.vue$/);
const routeMap = [];
requireRoutes.keys().map(fileName => {
  // ./input/examples/index.vue
  if (/examples\/index\.vue$/.test(fileName)) {
    fileName = fileName.replace(/^\.\//, '');
    const name = fileName.split('/')[0];
    routeMap.push({
      name,
      path: `/${name}`,
      component: () => import(`@cmp/${name}/examples`),
    });
    // console.debug({ fileName });
  }
});

console.log('routeMap\n', routeMap);

const config = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  ...routeMap,
  {
    path: '*',
    redirect: '/',
  },
  // {
  //   path: '/input',
  //   name: 'input',
  //   component: () => import('@cmp/input/examples'),
  // },
  // {
  //   path: '/virtual-list',
  //   name: 'virtual-list',
  //   component: () => import('@cmp/virtual-list/examples'),
  // },
  // {
  //   path: '/link-btn',
  //   name: '链接按钮',
  //   component: () => import('@cmp/link-btn/examples'),
  // },
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
