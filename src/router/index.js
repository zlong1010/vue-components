import Vue from "vue";
import VueRouter from "vue-router";
// import Index from "../views/home/Main.vue";

Vue.use(VueRouter);

const config = [
  {
    path: "/",
    name: "home",
    component: () => import("../../components/input"),
  },
  {
    path: "/input",
    name: "input",
    component: () => import("../../components/input"),
    // component: () => import(/* webpackChunkName: "fixed-size" */ "../views/fixed-size/Main.vue"),
  },
];

// just for development, if you want to run this project in your local
// please copy a any example and rename it as dev in example/src/views folder
if (process.env.NODE_ENV === "development") {
  // routes.push({
  //   path: '/dev',
  //   name: 'dev',
  //   component: () => import(/* webpackChunkName: "dev" */ '../views/dev/Main.vue')
  // })
}

const router = new VueRouter({
  routes: config,
});

export default router;