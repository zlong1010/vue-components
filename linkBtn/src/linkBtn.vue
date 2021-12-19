<template>
  <a class="c-ink-btn-wrap" :href="href" @click="handleClick" rel="noreferrer noopener">
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
      this.$routerJump(this.to, { blank, replace: this.replace });
      return false;
    },
  },
};
</script>
