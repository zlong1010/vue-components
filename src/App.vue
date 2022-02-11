<template>
  <div id="app">
    <Header />
    <div class="page-wrap">
      <div id="nav">
        <router-link to="/input">输入框</router-link>
        <router-link to="/virtual-list">虚拟列表</router-link>
      </div>
      <router-view class="page-content" />
    </div>
  </div>
</template>

<script>
import Header from './components/header';
export default {
  name: 'App',
  components: { Header },
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
