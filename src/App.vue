<template>
  <div id="app">
    <Header />
    <div class="page-wrap">
      <div id="nav">
        <router-link v-for="item in routeList" :to="`/${item}`" :key="item">{{item}}</router-link>
      </div>
      <router-view class="page-content" />
    </div>
  </div>
</template>

<script>
import Header from './components/header';

const requireRoutes = require.context('/components', true, /index\.vue$/);
const routeList = [];
requireRoutes.keys().map(fileName => {
  if (/examples\/index\.vue$/.test(fileName)) {
    fileName = fileName.replace(/^\.\//, '');
    const name = fileName.split('/')[0];
    routeList.push(name);
  }
});

export default {
  name: 'App',
  components: { Header },
  data() {
    return {
      routeList,
    };
  },
};
</script>

<style lang="less" scoped>
#app {
  /* background-color: #f5f5d5; */
}
.page-wrap {
  padding-top: 40px;
  position: relative;
}
#nav {
  width: 200px;
  position: fixed;
  top: 40px;
  bottom: 0;
  overflow: auto;
  border-right: 1px solid #d3d3d3;
  background-color: aqua;
  > * {
    display: block;
  }
}
.page-content {
  margin-left: 230px;
}
</style>
