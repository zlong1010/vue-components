<template>
  <header class="c-header">
    <router-link to="/">主页</router-link>
    <a href="https://github.com/zlong1010/vue-components" target="_blank" rel="noopener noreferrer" class="repo-link" style="line-height:0">
      <IconGithub width="24px" height="24px" />
    </a>
  </header>
</template>

<script>
import { IconGithub } from '/components/svg-icon';

export default {
  components: { IconGithub },
};
</script>

<style lang="less" scoped>
.c-header {
  position: fixed;
  width: 100%;
  height: 40px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d3d3d3;
  z-index: 1000;
  font-weight: bold;
  background: #fff;
  > * {
    margin-right: 8px;
    cursor: pointer;
  }
  > :last-child {
    margin: 0 0 0 auto;
  }
}
</style>
