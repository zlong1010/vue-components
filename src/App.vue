<template>
  <div id="app">
    <div id="nav">
      <router-link to="/input">input</router-link>
    </div>
    <Input />
  </div>
</template>

<script>
import Input from "../components/input/examples";

export default {
  name: "App",
  components: {
    Input,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
