/**
 * item and slot component both use similar wrapper
 * we need to know their size change at any time
 */

import Vue from 'vue';
import { ItemProps, SlotProps } from './props';

const Wrapper = {
  // data() {
  //   return {
  //     hasInitial: false,
  //   };
  // },
  created() {
    this.shapeKey = this.horizontal ? 'offsetWidth' : 'offsetHeight';
  },

  mounted() {
    // if (typeof ResizeObserver !== 'undefined') {
    //   this.resizeObserver = new ResizeObserver(() => {
    //     this.dispatchSizeChange();
    //   });
    //   this.resizeObserver.observe(this.$el);
    // }
    // this.dispatchSizeChange();
    const cycle = () => {
      const offsetHeight = Math.ceil(this.$el.offsetHeight);
      if (offsetHeight) {
        this.dispatchSizeChange();
      } else {
        requestAnimationFrame(cycle);
      }
    };
    requestAnimationFrame(cycle);
  },

  // since componet will be reused, so disptach when updated
  updated() {
    this.dispatchSizeChange();
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },

  methods: {
    // tell parent current size identify by unqiue key
    dispatchSizeChange() {
      // const widthOrHeight = this.$el ? this.$el[this.shapeKey] : 0;
      const offsetHeight = Math.ceil(this.$el.offsetHeight);
      const offsetLeft = Math.ceil(this.$el.offsetLeft);
      const offsetTop = Math.ceil(this.$el.offsetTop);
      this.$parent.$emit(this.event, this.uniqueKey, {
        index: this.index,
        offsetLeft,
        offsetTop,
        offsetHeight
      });
      // this.hasInitial = true;
    },
  },
};

// wrapping for item
export const Item = Vue.component('virtual-list-item', {
  mixins: [Wrapper],
  props: ItemProps,
  render(h) {
    const { tag, index, source, uniqueKey } = this;
    const itemProps = {
      source,
      index,
      uniqueKey,
    };
    return h(tag, this.$scopedSlots.default(itemProps));
    /* const props = {
      ...extraProps,
      source,
      index,
    };
    const props2 = {
      key: uniqueKey,
      attrs: {
        role: 'listitem',
      },
    };
    // old code
    if (slotComponent) {
      return h('div', slotComponent({ item: source, index, scope: { ...props, ...props2 } }));
    }
    return h(component, { props: { ...props, ...props2 }, scopedSlots });
    // old code
    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: 'listitem',
        },
      },
      [
        slotComponent
          ? h('div', slotComponent({ item: source, index, scope: props }))
          : h(component, {
            props,
            scopedSlots,
          }),
      ],
    ); */
  },
});

// wrapping for slot
export const Slot = Vue.component('virtual-list-slot', {
  mixins: [Wrapper],
  props: SlotProps,
  render(h) {
    const { tag, uniqueKey } = this;
    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: uniqueKey,
        },
      },
      this.$slots.default,
    );
  },
});
