<template>
  <transition name="slide-fade">
    <div :class="['c-toast', type]" v-show="visible">
      <span :class="[icon ? icon : iconClassMap[type], 'toast-icon']"></span>
      <span class="toast-text">{{ text }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      visible: false,
      // toast 类型 success | error | warning
      type: 'success',
      iconClassMap: {
        success: 'icon_toast_success',
        warning: 'icon_toast_warning',
        error: 'icon_toast_error',
      },
      text: '',
      icon: '',
      timeout: 1500,
      timerId: null,
    };
  },
  methods: {
    show() {
      this.visible && this.clearTimer(); // Toast已经在显示时，重复调用先重置Timer
      this.visible = true;
      if (this.timeout) {
        this.timerId = setTimeout(() => {
          this.visible = false;
          this.timerId = null;
        }, this.timeout);
      }
    },
    close() {
      this.visible = false;
      this.clearTimer();
    },
    clearTimer() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.c-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px 48px;
  border-radius: 20px;
  z-index: 100;
  &.success {
    background: #67C23A;
  }
  &.warning {
    background: #ffcd7b;
  }
  &.error {
    background: #f56c6c;
  }
  > span {
    display: inline-block;
    vertical-align: middle;
    &.toast-icon {
      margin-right: 8px;
    }
    &.toast-text {
      color: #06003B;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      color: #fff;
    }
  }
}
</style>
