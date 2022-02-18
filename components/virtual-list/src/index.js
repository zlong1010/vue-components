import Virtual from './virtual';
import { Item, Slot } from './item';
import { VirtualProps } from './props';

const EVENT_TYPE = {
  ITEM: 'item_resize',
  SLOT: 'slot_resize',
};
const SLOT_TYPE = {
  HEADER: 'thead', // string value also use for aria role attribute
  FOOTER: 'tfoot',
};

const Log = true;

export function dispatch(context, componentName, eventName, ...rest) {
  let parent = context.$parent || context.$root;
  let { name } = parent.$options;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.name;
    }
  }
  if (parent) {
    // eslint-disable-next-line no-useless-call
    parent.$emit.apply(parent, [eventName, ...rest]);
  }
}

export default {
  props: VirtualProps,

  data() {
    return {
      range: null,
      scrollContainer: null, // 滚动区域
      preItemSize: { id: '', index: -1, left: null, top: null, height: 0 },
      colNum: 0, // 一行的数量
      stopCalcuColNum: false,
      rendedItemCont: 0,
    };
  },

  watch: {
    'dataSources.length': function() {
      this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources());
      this.virtual.handleDataSourcesChange();
    },

    keeps(newValue) {
      this.virtual.updateParam('keeps', newValue);
      this.virtual.handleSlotSizeChange();
    },

    start(newValue) {
      this.scrollToIndex(newValue);
    },

    offset(newValue) {
      this.scrollToOffset(newValue);
    },
  },

  created() {
    // this.isHorizontal = this.direction === 'horizontal';
    this.isHorizontal = false; // 不支持水平滚动
    this.directionKey = this.isHorizontal ? 'scrollLeft' : 'scrollTop';

    this.installVirtual();

    // listen item size change
    this.$on(EVENT_TYPE.ITEM, this.onItemResized);

    // listen slot size change
    if (this.$slots.header || this.$slots.footer) {
      this.$on(EVENT_TYPE.SLOT, this.onSlotResized);
    }
  },

  // set back offset when awake from keep-alive
  activated() {
    this.scrollToOffset(this.virtual.offset);
  },

  mounted() {
    // 滚动区域
    let scrollContainer = null;
    if (this.pageMode) {
      scrollContainer = document;
    } else if (!this.$props.scrollArea) {
      scrollContainer = this.$el;
    } else if (typeof this.$props.scrollArea === 'string') {
      scrollContainer = document.querySelector(this.$props.scrollArea);
    } else {
      scrollContainer = this.$props.scrollArea;
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', this.onScroll, {
        passive: true,
      });
      this.scrollContainer = scrollContainer;
    } else {
      console.error(`\ncan't find scroll element by ${this.$props.scrollArea}`);
    }
    if (this.pageMode) {
      this.updatePageModeFront();
    }
    // set position
    if (this.start) {
      this.scrollToIndex(this.start);
    } else if (this.offset) {
      this.scrollToOffset(this.offset);
    }
  },

  beforeDestroy() {
    this.virtual.destroy();
    this.scrollContainer.removeEventListener('scroll', this.onScroll, {
      passive: true,
    });
  },

  methods: {
    getIndexOffset(index) {
      return this.virtual.getIndexOffset(index);
    },

    getItemsRendFinish() {
      return this.virtual.getItemsRendFinish();
    },
    // return current scroll offset
    getOffset() {
      if (this.pageMode) {
        return document.documentElement[this.directionKey] || document.body[this.directionKey];
      }
      return Math.ceil(this.scrollContainer[this.directionKey]);
    },

    // return client viewport size
    getClientSize() {
      const key = this.isHorizontal ? 'clientWidth' : 'clientHeight';
      if (this.scrollContainer === document) {
        return document.documentElement[key] || document.body[key];
      }
      return Math.ceil(this.scrollContainer[key]);
    },

    // return all scroll size
    getScrollSize() {
      const key = this.isHorizontal ? 'scrollWidth' : 'scrollHeight';
      if (this.scrollContainer === document) {
        return document.documentElement[key] || document.body[key];
      }
      return Math.ceil(this.scrollContainer[key]);
    },

    // set current scroll position to a expectant offset
    scrollToOffset(offset) {
      if (this.pageMode) {
        document.body[this.directionKey] = offset;
        document.documentElement[this.directionKey] = offset;
      } else {
        this.scrollContainer[this.directionKey] = offset;
      }
    },

    // set current scroll position to a expectant index
    scrollToIndex(index) {
      // scroll to bottom
      if (index >= this.dataSources.length - 1) {
        this.scrollToBottom();
      } else {
        const offset = this.virtual.getOffset(index);
        this.scrollToOffset(offset);
      }
    },

    // set current scroll position to bottom
    scrollToBottom() {
      const { shepherd } = this.$refs;
      if (shepherd) {
        const offset = shepherd[this.isHorizontal ? 'offsetLeft' : 'offsetTop'];
        this.scrollToOffset(offset);

        // check if it's really scrolled to the bottom
        // maybe list doesn't render and calculate to last range
        // so we need retry in next event loop until it really at bottom
        setTimeout(() => {
          if (this.getOffset() + this.getClientSize() < this.getScrollSize()) {
            this.scrollToBottom();
          }
        }, 3);
      }
    },

    // when using page mode we need update slot header size manually
    // taking root offset relative to the browser as slot header size
    updatePageModeFront() {
      const rootEle = this.$el;
      if (rootEle) {
        const rect = rootEle.getBoundingClientRect();
        const { defaultView } = rootEle.ownerDocument;
        // pageXOffset pageYOffset
        const offsetFront = this.isHorizontal ? rect.left + defaultView.scrollX : rect.top + defaultView.scrollY;
        this.virtual.updateParam('slotHeaderSize', offsetFront);
      }
    },

    // reset all state back to initial
    reset() {
      this.virtual.destroy();
      this.scrollToOffset(0);
      this.installVirtual();
    },

    // ----------- public method end -----------

    installVirtual() {
      this.virtual = new Virtual(
        {
          slotHeaderSize: this.slotHeaderSize,
          slotFooterSize: this.slotFooterSize,
          keeps: this.keeps,
          estimateSize: this.estimateSize,
          buffer: 5, // 缓存行数
          uniqueIds: this.getUniqueIdFromDataSources(),
        },
        this.onRangeChanged,
      );

      // sync initial range
      this.range = this.virtual.getRange();
    },

    getUniqueIdFromDataSources() {
      const { dataKey } = this;
      return this.dataSources.map(dataSource =>
        typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey],
      );
    },

    /* onItemResized_back(id, index, { offsetLeft, offsetTop, offsetHeight }) {
      const { preItemSize } = this.$data;
      if (preItemSize.left === null) {
        this.preItemSize.left = offsetLeft;
      }
      if (preItemSize.left === offsetLeft && preItemSize.id && id !== preItemSize.id) {
        // 每行的高度, 包括margin
        const overRow = Math.ceil((index + 1) / this.colNum) - Math.ceil((preItemSize.index + 1) / this.colNum);
        if (index > preItemSize.index && overRow < 2) {
          const preOffsetHeight = offsetTop - preItemSize.top;
          // Log && console.log(`\npreInd:${preItemSize.index}  index:${index} %ch: ${preOffsetHeight}`, 'color:red');
          // 每行最后一项的size
          preOffsetHeight && this.virtual.saveSize(preItemSize.index, preOffsetHeight);
          this.stopCalcuColNum = true;
          const newKeeps = Math.ceil(this.keeps / this.colNum) * this.colNum;
          if (newKeeps !== this.keeps) {
            this.virtual.updateParam('keeps', newKeeps);
          }
          // this.$emit('resized', preItemSize.id, preOffsetHeight);
        } else if (index < preItemSize.index) {
          console.log('\n**********向上**********\n');
        } else {
          console.error('\nonItemResized error!');
        }
      } else if (!this.stopCalcuColNum && id !== preItemSize.id) {
        this.colNum++;
      }
      this.preItemSize = { index, id, left: this.preItemSize.left, top: offsetTop, height: offsetHeight };
      // if (index === this.range.end) {
      //   this.virtual.saveSize(id, offsetHeight);
      //   this.stopCalcuColNum = true;
      // }
    }, */

    onItemResized(id, { index, offsetLeft, offsetTop, offsetHeight }) {
      const rowHeight = offsetHeight + this.$props.lineInterval;
      const { preItemSize } = this.$data;
      // range item mounted
      id !== preItemSize.id && this.rendedItemCont++;
      const N = Math.min(this.dataSources.length, this.keeps);
      if (this.rendedItemCont === N) {
        this.virtual.rendFinish(this.colNum);
      }

      if (preItemSize.left === null) {
        this.preItemSize.left = offsetLeft;
      }
      if (preItemSize.left === offsetLeft && preItemSize.id && id !== preItemSize.id) {
        // 每行的高度, 包括margin
        console.log(`\npreInd:${preItemSize.index}  index:${index} %ch: ${preItemSize.height}`, 'color:red');
        if (!this.stopCalcuColNum) {
          const newKeeps = Math.ceil(this.keeps / this.colNum) * this.colNum;
          if (newKeeps !== this.keeps) {
            this.virtual.updateParam('keeps', newKeeps);
          }
        }
        // 每行最后一项的size
        this.virtual.saveSize(preItemSize.index, preItemSize.height);
        this.$emit('resized', preItemSize.id, preItemSize.height);
        this.stopCalcuColNum = true;
        // const overRow = Math.ceil((index + 1) / this.colNum) - Math.ceil((preItemSize.index + 1) / this.colNum);
        // if (index > preItemSize.index && overRow < 2) {
        // }
      } else if (!this.stopCalcuColNum && id !== preItemSize.id) {
        this.colNum++;
      }
      this.preItemSize = { index, id, left: this.preItemSize.left, top: offsetTop, height: rowHeight };
    },
    // event called when slot mounted or size changed
    onSlotResized(type, size, hasInit) {
      if (type === SLOT_TYPE.HEADER) {
        this.virtual.updateParam('slotHeaderSize', size.offsetHeight);
      } else if (type === SLOT_TYPE.FOOTER) {
        this.virtual.updateParam('slotFooterSize', size.offsetHeight);
      }
      // if (hasInit) {
      //   this.virtual.handleSlotSizeChange();
      // }
    },

    // here is the rerendering entry
    onRangeChanged(range) {
      this.range = range;
    },

    onScroll(evt) {
      requestAnimationFrame(() => {
        const offset = this.getOffset();
        const clientSize = this.getClientSize();
        const scrollSize = this.getScrollSize();
        // iOS scroll-spring-back behavior will make direction mistake
        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
          return;
        }
        this.virtual.handleScroll(offset);
        this.emitEvent(offset, clientSize, scrollSize, evt);
      });
    },

    // emit event in special position
    emitEvent(offset, clientSize, scrollSize, evt) {
      this.$emit('scroll', evt, this.virtual.getRange());
      if (this.virtual.isFront() && !!this.dataSources.length && offset - this.topThreshold <= 0) {
        this.$emit('totop');
      } else if (this.virtual.isBehind() && offset + clientSize + this.bottomThreshold >= scrollSize) {
        this.$emit('tobottom');
      }
    },

    // get the real render slots based on range data
    // in-place patch strategy will try to reuse components as possible
    // so those components that are reused will not trigger lifecycle mounted
    getRenderSlots(h) {
      const { dataKey, dataSources } = this;
      const { start, end } = this.range;
      const slots = [];
      Log && console.log('\n%crender!%c start: %d end: %d\n', 'color:red', '', start, end);
      if (end <= start || dataSources.length === 0) {
        return [];
      }

      // const slotComponent = this.$scopedSlots.item;
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index];
        if (dataSource) {
          const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];
          if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
            slots.push(
              h(Item, {
                key: uniqueKey, // 是否复用dom？
                props: {
                  index,
                  uniqueKey,
                  source: dataSource,
                  event: EVENT_TYPE.ITEM,
                  tag: this.$props.itemTag,
                  horizontal: this.isHorizontal,
                },
                class: 'virtual-list-item ' + (this.$props.itemClass || ''),
                style: this.$props.itemStyle,
                attrs: { index, role: 'listotem' },
                scopedSlots: {
                  default: this.$scopedSlots.item,
                },
              }),
            );
          } else {
            console.error(`Cannot get the data-key '${dataKey}' from data-sources.`);
          }
        } else {
          console.error(`Cannot get the index '${index}' from data-sources.`);
        }
      }
      return slots;
    },
  },

  // render function, a closer-to-the-compiler alternative to templates
  // https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth
  render(h) {
    const { header, footer } = this.$slots;
    const { padFront, padBehind } = this.range;
    const { isHorizontal } = this;
    const paddingStyle = {
      padding: isHorizontal ? `0px ${padBehind}px 0px ${padFront}px` : `${padFront}px 0px ${padBehind}px`,
    };
    const wrapperStyle = this.wrapStyle ? { ...this.wrapStyle, ...paddingStyle } : paddingStyle;
    return h(
      this.rootTag,
      {
        ref: 'root',
        // on: { '&scroll': !this.pageMode && this.onScroll },
      },
      [
        // header slot
        header
          ? h(
              Slot,
              {
                class: this.headerClass,
                style: this.headerStyle,
                props: {
                  tag: this.headerTag,
                  event: EVENT_TYPE.SLOT,
                  uniqueKey: SLOT_TYPE.HEADER,
                },
              },
              header,
            )
          : null,

        // main list
        h(
          this.wrapTag,
          {
            class: this.wrapClass,
            attrs: { role: 'group' },
            style: wrapperStyle,
          },
          this.getRenderSlots(h),
        ),

        // footer slot
        footer
          ? h(
              Slot,
              {
                class: this.footerClass,
                style: this.footerStyle,
                props: {
                  tag: this.footerTag,
                  event: EVENT_TYPE.SLOT,
                  uniqueKey: SLOT_TYPE.FOOTER,
                },
              },
              footer,
            )
          : null,

        // an empty element use to scroll to bottom
        h('div', {
          ref: 'shepherd',
          style: {
            width: isHorizontal ? '0px' : '100%',
            height: isHorizontal ? '100%' : '0px',
          },
        }),
      ],
    );
  },
};