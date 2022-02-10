<template>
  <div class="c-input">
    <div :class="[`${clsPrefix}-search`, { search }]">
      <span v-if="search" class="icon_search"></span>
      <div class="c-input-desc-wrap">
        <div :class="[`${clsPrefix}-content`, { textarea, copy: hasCopy }]" :style="inputStyle">
          <textarea
            v-if="textarea"
            v-bind="attrs"
            :value="value"
            v-on="listeners"
            class="input"
            :placeholder="visibleFakerVal ? '' : placeholder"
          ></textarea>
          <input
            v-else
            v-bind="attrs"
            :value="value"
            v-on="listeners"
            class="input"
            :placeholder="visibleFakerVal ? '' : placeholder"
          />
          <span v-if="textarea && attrs.maxlength" :class="`${clsPrefix}-count`">
            {{ `${numWord}/${attrs.maxlength}` }}
          </span>
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
const defaultAttr = {
  type: 'text',
};

export default {
  name: 'Input',
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
      clsPrefix: 'c-input',
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
      if (copyString(this.value || '')) {
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

function copyString(str) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(str);
  }
  const input = document.createElement('textarea');
  input.readOnly = 'readonly';
  input.style.position = 'fixed';
  input.style.clip = 'rect(0 0 0 0)';
  input.style.top = '10px';
  input.value = str;
  document.body.appendChild(input);
  input.select();
  const isSuccess = document.execCommand('copy');
  document.body.removeChild(input);
  return isSuccess;
}
</script>

<style lang="less" scoped>
.c-input {
  position: relative;
  .c-input-search {
    position: relative;
    .icon_search {
      margin-left: 8px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }
    &.search {
      input {
        padding-left: 36px;
        text-indent: 0;
      }
    }
  }
  .c-input-desc-wrap {
    position: relative;
    .c-input-desc {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 440px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      font-size: 12px;
      color: #7f8fa4;
      line-height: 18px;
      font-weight: 400;
      &:empty {
        display: none;
      }
    }
  }
  .c-input-content {
    min-height: 40px;
    position: relative;
    background: #ffffff;
    font-size: 14px;
    color: #06003b;
    // overflow: hidden;
    .faker-value {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      padding: 12px 8px 8px 12px;
    }
    input {
      width: 100%;
      height: 40px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      vertical-align: middle;
      transition: border 0.15s ease-out;
      outline: none;
      text-indent: 12px;
      font-size: 14px;
      color: #06003b;
      &:focus {
        border-color: #3a51e0;
      }
    }
    textarea {
      width: 100%;
      height: 100%;
      min-height: 90px;
      padding: 8px 8px 8px 12px;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      vertical-align: middle;
      overflow: auto; // 隐藏ie滚动条
      transition: border 0.15s ease-out;
      outline: none;
      .min-placeholder {
        font-size: 14px;
        color: #c0c4cc;
        line-height: 24px;
        font-weight: 400;
      }
      &::placeholder {
        .min-placeholder();
      }
      &::-webkit-input-placeholder,
      &::-moz-placeholder,
      &:-ms-input-placeholder {
        .min-placeholder();
      }
      &:focus {
        border-color: #3a51e0;
      }
    }
    .copy_icon_black {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
    }
    .c-input-count {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 10px;
      color: #bfc4cd;
      text-align: right;
      line-height: 14px;
      font-weight: 400;
    }
    .more-btn {
      line-height: 0;
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translate(100%, -50%);
    }
    &.copy {
      input,
      textarea {
        padding-right: 32px;
      }
    }
  }
  .c-input-error {
    max-width: 358px;
    display: flex;
    margin-top: 8px;
    align-items: center;
    font-size: 12px;
    color: #f56c6c;
    line-height: 18px;
    font-weight: 400;
    word-break: break-all;
    &:empty {
      display: none;
    }
    &::before {
      width: 16px;
      height: 16px;
      min-width: 16px;
      margin: 2px 8px 0 0;
      align-self: flex-start;
      content: '';
      display: inline-block;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEUAAAD2bGz2bGz2bGz2bGz2bW31bW32bGz2b2/3b2//gID2bW31bGz////++Pj6uLgOA9FkAAAADHRSTlMA5vPZv4yFdlM8CKjvXHhZAAAAq0lEQVQoz2OAgKnOSiaRDHDAVXgGBMQXwAQaz0CABJTPdgYGEiACe+ACp2EKUJX0IAmcAFkhA2Kdfw8WOAi0iB3MOncPoqSAgYERzDh7FyIgwMAwB0XgJANDDIrAUQYGHxSBIwwMNigChxkYdFAEDmEKYGrxQXHYEZC1EKfDrZ0D9RfcYYxQJtzp7ChaCkDehxgK9z5DD5KKExhBiBnImNGAGVGYUYmIbOIAALoXE/rM7duLAAAAAElFTkSuQmCC);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
</style>
