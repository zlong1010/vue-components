<template>
  <div :class="['vd8dke-loading-wrap', { 'vd8dke-page-bgfilter': isBlur }]">
    <div class="vd8dke-page-loading">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p class="title">{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    isBlur: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    updateUi(config) {
      const keys = Object.keys(config);
      const el = this.$el;
      keys.forEach(k => {
        const v = config[k];
        if (v === this[k]) return;
        if (k === 'title') {
          el.querySelector('.title').textContent = v;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.vd8dke-loading-wrap {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 1000;
  outline: 1px solid blue;
  .vd8dke-page-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    z-index: 100;
  }
  .title {
    margin-top: 24px;
    font-size: 16px;
    line-height: 28px;
    color: #06003b;
    font-weight: bold;
    text-align: center;
    &:empty {
      display: none;
    }
  }
}
// 背景毛玻璃效果
.vd8dke-page-bgfilter {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(3px);
    z-index: 10;
  }
}
// loading
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lds-ring {
  margin: 0 auto;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    border-color: #3c6dff transparent transparent transparent;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
}
</style>
