<template>
  <div class="c-inputv2-wrap">
    <div :class="[`${clsPrefix}-search`, { search }]">
      <span v-if="search" class="icon_search"></span>
      <div class="c-inputv2-desc-wrap">
        <div :class="[`${clsPrefix}-content`, { textarea, copy: hasCopy }]" :style="inputStyle">
          <textarea v-if="textarea" v-bind="attrs" :value="value" v-on="listeners" class="input" :placeholder="visibleFakerVal ? '' : placeholder"></textarea>
          <input v-else v-bind="attrs" :value="value" v-on="listeners" class="input" :placeholder="visibleFakerVal ? '' : placeholder"/>
          <span v-if="textarea && attrs.maxlength" :class="`${clsPrefix}-count`">{{ `${numWord}/${attrs.maxlength}` }}</span>
          <span v-if="hasCopy" @click="handleCopy" class="copy_icon_black"></span>
          <div class="more-btn">
            <slot name="morebtn"></slot>
          </div>
          <p v-if="visibleFakerVal" class="faker-value">{{ fakerValue }}</p>
        </div>
        <p :class="`${clsPrefix}-desc`">{{ desc }}</p>
      </div>
    </div>
    <p :class="`${clsPrefix}-error`">{{ errMsg }}</p>
  </div>
</template>

<script>
import { Tool } from '@/util';

const defaultAttr = {
  type: 'text',
};

export default {
  name: 'InputV2',
  inheritAttrs: false,
  props: {
    value: [String, Number],
    search: {
      type: Boolean,
      default: false,
    },
    hasCopy: {
      type: Boolean,
      default: false,
    },
    // 字段描述
    desc: {
      type: String,
      default: '',
    },
    errMsg: {
      type: String,
      default: '',
    },
    width: [Number, String],
    height: [Number, String],
    // 是否是textarea
    textarea: {
      type: Boolean,
      default: false,
    },
    // 失焦时自动清除空白
    cleanBlank: {
      type: Boolean,
      default: true,
    },
    fakerValue: String,
    placeholder: String,
  },
  data() {
    return {
      clsPrefix: 'c-inputv2',
      numWord: 0,
      hasChanged: false, // 处理ie bug
      firstFocus: false, // focus一次之后不再显示faker value
    };
  },
  computed: {
    attrs() {
      return { ...this.$attrs, ...defaultAttr };
    },
    listeners() {
      const propsListeners = this.$listeners;
      return {
        ...propsListeners,
        input: this.handleInput,
        blur: this.handleBlur,
        focus: this.handleFocus,
      };
    },
    inputStyle() {
      const dst = {};
      ['width', 'height'].forEach(k => {
        const propVal = this[k];
        if (typeof propVal !== 'undefined') {
          if (Number.isNaN(Number(propVal))) {
            dst[k] = propVal;
          } else {
            dst[k] = `${propVal}px`;
          }
        }
      });
      return dst;
    },
    visibleFakerVal() {
      return !this.firstFocus && this.fakerValue && !this.value;
    },
  },
  methods: {
    handleInput(e) {
      if (this.$attrs.disabled) return;
      const dom = e.target;
      let val = dom.value;
      if (this.$attrs.type === 'number') {
        val = val.replace(/\D/g, '');
      }
      const maxlength = Number(this.$attrs.maxlength || 0);
      if (maxlength && val.length > maxlength) {
        val = val.slice(0, maxlength);
      }
      if (dom.value !== val) {
        dom.value = val;
      }
      if (this.hasChanged) {
        this.$emit('input', val, e);
      }
    },
    handleBlur(e) {
      if (this.$attrs.disabled) return;
      const dom = e.target;
      const val = dom.value.trim();
      if (this.cleanBlank) {
        this.$emit('input', val, e, 'blur'); // 更新父组件value
        this.$emit('change', e);
        if (dom.value !== val) {
          dom.value = val;
        }
      }
      this.$emit('blur', e, val);
    },
    handleCopy() {
      if (Tool.copyString(this.value || '')) {
        this.$toast('复制成功');
      } else {
        this.$toast('复制失败');
      }
    },
    handleFocus() {
      this.hasChanged = true;
      this.firstFocus = true;
      this.$emit('focus');
    },
    // 供父组件调用
    focus() {
      this.$el.querySelector('.input').focus();
    },
  },
  watch: {
    value(newVal) {
      this.numWord = (newVal || '').length;
    },
  },
  mounted() {
    this.numWord = (this.value || '').length;
  },
};
</script>
