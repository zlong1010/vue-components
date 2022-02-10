<template>
  <div class="p-virtual-list">
    <div class="tab-list" @click="toggleAct">
      <span data-k="fix-size">固定尺寸</span>
      <router-link to="/dynamic-size">dynamic size</router-link>
      <span class="line">|</span>
      <router-link to="/horizontal">horizontal</router-link>
      <span class="line">|</span>
      <router-link to="/infinite-loading">infinite loading</router-link>
      <span class="line">|</span>
      <router-link to="/keep-state">keep state</router-link>
      <span class="line">|</span>
      <router-link to="/page-mode">page mode</router-link>
      <span class="line">|</span>
      <router-link to="/chat-room">chat room</router-link>
    </div>
    <component :is="who" />
  </div>
</template>

<script>
import Vue from 'vue';
import VirtualList from '../src';
Vue.component('virtual-list', VirtualList);

const requireGlobal = require.context('./components', false, /\w+\.(vue|js)$/);
const successCmp = [];
requireGlobal.keys().forEach(fileName => {
  const componentConfig = requireGlobal(fileName);
  const cmp = componentConfig.default || componentConfig;
  if (!cmp.name) {
    console.error(`${fileName} no component name!`);
    return;
  }
  successCmp.push(cmp.name);
  Vue.component(cmp.name, cmp);
});
console.log('\n全局注册:\n', successCmp.join('\n'));

// 批量注册局部组件
const requireComponent = require.context('./views', true, /(Main|index)\.(vue|js)$/);
const cmps = {};
requireComponent.keys().map(fileName => {
  const cmp = requireComponent(fileName).default || componentConfig;
  if (!cmp.name) {
    console.error(`${fileName} no component name!`);
    return;
  }
  cmps[cmp.name] = cmp;
});
console.log('收集到以下组件: \n', Object.keys(cmps).join('\n'));

export default {
  components: cmps,
  data() {
    return {
      who: 'fix-size',
    };
  },
  methods: {
    toggleAct(e) {
      const cmp = e.target.getAttribute('data-k');
      this.who = cmp;
    },
  },
};
</script>

<style lang="less" scoped>
.p-virtual-list {
  @media (max-width: 640px) {
    padding: 3px;
    width: 100%;
  }
}

.tab-list {
  color: #fff;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 1em;
  white-space: nowrap;
  overflow-x: auto;
  z-index: 2;
  > * {
    cursor: pointer;
  }
  @media (max-width: 640px) {
    padding: 0;
    position: relative;
    background-color: unset;
    color: unset;
    height: unset;
    padding-left: unset;
    align-items: unset;
  }
  .router-link-exact-active,
  .router-link-exact-active:hover {
    color: inherit;
    cursor: default;
    text-decoration: underline;
    @media (max-width: 640px) {
      border-bottom: 1px solid;
      border-color: #606c76;
      text-decoration: none;
    }
  }
}

.example {
  margin: 0 auto;
  padding: 0 2em;
  width: 776px;
  padding-top: 3em;
  @media (max-width: 640px) {
    margin: unset;
    padding: unset;
    width: unset;
    padding-top: unset;
  }
}
.example-content {
  margin-top: 1em;
  background-color: #fff;
  position: relative;
  z-index: 1;
}

.scroll-touch {
  -webkit-overflow-scrolling: touch;
  /* width */
  &::-webkit-scrollbar {
    width: 10px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: #f4f4f4;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: rgba(0, 0, 0, 0.12);
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b2b2b2;
  }
}

code {
  background-color: pink !important;
}
</style>
