<template>
  <div>
    <button class="btn" @click="onClick">成功</button>
    <button class="btn" @click="onClick">失败</button>
  </div>
</template>

<script>
import Vue from 'vue';
import Toast from '../index.js';

Vue.use(Toast);

export default {
  methods: {
    onClick(e) {
      const text = e.target.textContent;
      const type = text === '成功' ? 'success' : 'error';
      this.$toast({ type, text });
    },
  },
};
</script>

<style lang="less" scoped>
.btn {
  display: block;
  margin: 16px;
}
</style>