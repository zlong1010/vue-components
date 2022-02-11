<template>
  <header class="header">
    <router-link to="/">主页</router-link>
    <github-corner />
    <!-- <a href="https://github.com/zlong1010/vue-components" target="_blank" rel="noopener noreferrer" class="repo-link">
      <span>GitHub</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        width="15"
        height="15"
        class="icon outbound"
      >
        <path
          fill="currentColor"
          d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
        ></path>
        <polygon
          fill="currentColor"
          points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
        ></polygon>
      </svg>
    </a> -->
  </header>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d3d3d3;
  z-index: 1000;
  background-color: antiquewhite;
  > * {
    margin-right: 8px;
    cursor: pointer;
  }
  > :last-child {
    margin: 0 0 0 auto;
  }
}
</style>
