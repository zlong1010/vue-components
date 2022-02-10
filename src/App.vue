<template>
  <div id="app">
    <Header />
    <div class="page-wrap">
      <div id="nav">
        <router-link to="/input">input</router-link>
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

<style>
#app {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
}
.page-wrap {
  display: flex;
  outline: 1px solid red;
}
#nav {
  flex: 0 0 auto;
  height: calc(100vh - 32px);
  min-width: 10rem;
  overflow: auto;
  background-color: aqua;
}
.page-content {
  margin-left: 24px;
}
</style>
