<template>
  <a class="c-ink-btn" :href="href" @click="handleClick" rel="noreferrer noopener">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'LinkBtn',
  props: {
    to: [Object, String],
    replace: {
      type: Boolean,
      default: false,
    },
    // 新标签页打开
    _blank: {
      type: Boolean,
      default: false,
    },
    // 为true时不能跳转
    disable: Boolean,
  },
  computed: {
    href({ to }) {
      return this.$router.resolve(to).href;
    },
  },
  methods: {
    handleClick(event) {
      event.preventDefault();
      this.$emit('click', this.to, event);
      if (this.disable) {
        return false;
      }
      const blank = this._blank || event.ctrlKey || event.metaKey;
      this.routerJump(this.to, { blank, replace: this.replace });
      return false;
    },
    routerJump(routeConfig, args) {
      const defaultArgs = { blank: false, replace: false, event: {} };
      // 点击事件
      if (args instanceof Event) {
        args = Object.assign(defaultArgs, { event: args });
      } else {
        args = Object.assign(defaultArgs, args);
      }
      // event: Boolean | MouseEvent
      let isNewTab = false;
      if (args.blank || args.event.ctrlKey || args.event.metaKey) {
        isNewTab = true;
      }
      const newHref = this.$router.resolve(routeConfig).href;
      if (isNewTab) {
        window.open(newHref, '_blank');
        return;
      }
      if (newHref === window.location.href) {
        return;
      }

      if (args.replace) {
        this.$router.replace(routeConfig).catch(() => {});
      } else {
        this.$router.push(routeConfig).catch(() => {});
      }
    },
  },
};
</script>

<style lang="less" scoped>
.c-ink-btn {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
</style>
