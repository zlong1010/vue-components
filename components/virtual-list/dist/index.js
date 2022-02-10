/*!
 * vue-virtual-scroll-list v1.0.0
 * open source under the MIT license
 * https://github.com/zlong1010/vue-components/tree/master/virtual-list
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global.VirtualList = {}, global.Vue));
}(this, (function (exports, Vue) { 'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  // import DebugBox from './debug';
  var DIRECTION_TYPE = {
    FRONT: 'FRONT',
    // scroll up or left
    BEHIND: 'BEHIND' // scroll down or right

  };
  var CALC_TYPE = {
    INIT: 'INIT',
    FIXED: 'FIXED',
    DYNAMIC: 'DYNAMIC'
  };
  var LEADING_BUFFER = 0;

  var Virtual = /*#__PURE__*/function () {
    function Virtual(param, callUpdate) {
      _classCallCheck(this, Virtual);

      console.log('\ninit virtual');
      this.init(param, callUpdate);
    }

    _createClass(Virtual, [{
      key: "init",
      value: function init(param, callUpdate) {
        // param data
        this.param = param;
        this.callUpdate = callUpdate; // const _sizes = Array(param.uniqueIds.length).fill(0);

        var N = 0;

        if (param) {
          N = param.uniqueIds.length;
        }

        this.sizes = Array(N).fill(0);
        this.firstRangeTotalSize = 0;
        this.firstRangeAverageSize = 0;
        this.lastCalcIndex = 0;
        this.fixedSizeValue = 0;
        this.calcType = CALC_TYPE.INIT;
        this.colNum = 0;
        this.isRendFinish = false; // 所有的item渲染完成
        // scroll data

        this.offset = 0;
        this.direction = ''; // range data

        this.range = Object.create(null);

        if (param) {
          this.checkRange(0, param.keeps - 1);
        }

        var fn = function fn() {
          // DebugBox.updateText({
          //   colNum: this.colNum,
          //   buffer: this.param.buffer,
          //   keeps: this.param.keeps,
          //   N: this.param.uniqueIds.length,
          //   size: this.sizes,
          // });
          requestAnimationFrame(fn);
        };

        requestAnimationFrame(fn);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.init(null, null);
      } // return current render range

    }, {
      key: "getRange",
      value: function getRange() {
        var range = Object.create(null);
        range.start = this.range.start;
        range.end = this.range.end;
        range.padFront = this.range.padFront;
        range.padBehind = this.range.padBehind;
        return range;
      }
    }, {
      key: "isBehind",
      value: function isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND;
      }
    }, {
      key: "isFront",
      value: function isFront() {
        return this.direction === DIRECTION_TYPE.FRONT;
      } // return start index offset

    }, {
      key: "getOffset",
      value: function getOffset(start) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
      }
    }, {
      key: "updateParam",
      value: function updateParam(key, value) {
        if (this.param && key in this.param) {
          this.param[key] = value;

          if (key === 'uniqueIds') {
            var preNum = this.sizes.length;

            if (value.length > preNum) {
              this.sizes = this.sizes.concat(Array(value.length - preNum).fill(0));
              this.fillSizeByEstiSize();
            }
          } else if (key === 'keeps') {
            this.checkRange(this.range.start, this.range.end);
          }
        }
      } // save each size map by id

    }, {
      key: "saveSize",
      value: function saveSize(idx, size) {
        this.sizes[idx] = size;

        if (this.calcType === CALC_TYPE.INIT) {
          this.fixedSizeValue = size;
          this.calcType = CALC_TYPE.FIXED;
        } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
          this.calcType = CALC_TYPE.DYNAMIC;
          this.fixedSizeValue = 0;
        }
      } // 第一次 range item mounted

    }, {
      key: "rendFinish",
      value: function rendFinish(colNum) {
        this.isRendFinish = true;
        var _range = this.range;
        this.colNum = colNum; // 更新缓存buffer

        this.param.buffer = Math.max(Math.round(this.param.keeps / (colNum * 3)), 1); // 设置平均值

        this.firstRangeTotalSize = this.sizes.slice(_range.start, _range.end + 1).reduce(function (acc, val) {
          return acc + val;
        }, 0);
        this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize * colNum / (_range.end - _range.start + 1));
        this.fillSizeByEstiSize();
      }
    }, {
      key: "fillSizeByEstiSize",
      value: function fillSizeByEstiSize() {
        var _this = this;

        this.sizes.forEach(function (v, ind) {
          if ((ind + 1) % _this.colNum === 0 && v === 0) {
            _this.sizes[ind] = _this.getEstimateSize();
          }
        });
      } // in some special situation (e.g. length change) we need to update in a row
      // try goiong to render next range by a leading buffer according to current direction

    }, {
      key: "handleDataSourcesChange",
      value: function handleDataSourcesChange() {
        var start = this.range.start;

        if (this.isFront()) {
          start -= LEADING_BUFFER;
        } else if (this.isBehind()) {
          start += LEADING_BUFFER;
        }

        start = Math.max(start, 0);
        this.updateRange(this.range.start, this.getEndByStart(start));
      } // when slot size change, we also need force update

    }, {
      key: "handleSlotSizeChange",
      value: function handleSlotSizeChange() {
        this.handleDataSourcesChange();
      } // calculating range on scroll

    }, {
      key: "handleScroll",
      value: function handleScroll(offset) {
        this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
        this.offset = offset;

        if (!this.param) {
          return;
        }

        if (this.direction === DIRECTION_TYPE.FRONT) {
          this.handleFront();
        } else if (this.direction === DIRECTION_TYPE.BEHIND) {
          // 向下滚动
          this.handleBehind();
        }
      } // ----------- public method end -----------

    }, {
      key: "getItemsRendFinish",
      value: function getItemsRendFinish() {
        return this.isRendFinish;
      }
    }, {
      key: "handleFront",
      value: function handleFront() {
        if (this.range.start === 0) {
          return;
        }

        var overs = this.getScrollOvers('front'); // should not change range if start doesn't exceed overs

        if (overs * this.colNum >= this.range.start + this.colNum) {
          return;
        }

        var start = Math.max(overs - this.param.buffer, 0) * this.colNum;
        this.checkRange(start, this.getEndByStart(start));
      } // 向下滚动

    }, {
      key: "handleBehind",
      value: function handleBehind() {
        if (this.range.end === this.param.uniqueIds.length - 1) {
          return;
        } // start 滚动over的行数


        var overs = this.getScrollOvers('behind'); // range should not change if scroll overs within buffer

        if (overs * this.colNum < this.range.start + this.param.buffer * this.colNum) {
          return;
        }

        this.checkRange(overs * this.colNum, this.getEndByStart(overs * this.colNum));
      } // return the pass overs according to current scroll offset
      // 滚动了多少行

    }, {
      key: "getScrollOvers",
      value: function getScrollOvers(direction) {
        // offset: scrollTop
        var offset = this.offset - this.param.slotHeaderSize; // 第一行高度

        var _idx = this.sizes.findIndex(function (v) {
          return !!v;
        });

        var firstRowHeight = _idx !== -1 ? this.sizes[_idx] : 0;

        if (offset <= 0 || !firstRowHeight || offset < firstRowHeight) {
          this.rowOver = 0;
          return 0;
        } // 固定高度


        if (this.isFixedType()) {
          this.rowOver = Math.floor(offset / this.fixedSizeValue);
          return this.rowOver;
        } // 动态高度


        var low = 0;
        var middle = 0;
        var middleOffset = 0;
        var high = this.param.uniqueIds.length;
        var _range = this.range;

        if (offset > this.getIndexOffset(_range.start)) {
          low = _range.start;
        }

        if (offset < this.getIndexOffset(_range.end)) {
          high = _range.end;
        }

        while (low <= high) {
          middle = low + Math.floor((high - low) / 2);
          middleOffset = this.getIndexOffset(middle);

          if (middleOffset === offset) {
            this.rowOver = middle;
            return this.rowOver;
          }

          if (middleOffset < offset) {
            low = middle + 1;
          } else if (middleOffset > offset) {
            high = middle - 1;
          }
        }

        this.rowOver = low > 0 ? --low : 0;
        return this.rowOver; // let rowOver = 0;
        // const _range = this.range;
        // const _totalSizesHeight = this.sizes.slice(0, _range.end + 1).reduce((acc, cur) => acc + cur, 0);
        // // 特殊情况，滚动太快，sizes中还没有存入实际的dom高度
        // if (_totalSizesHeight < offset) {
        //   console.error('\n_totalSizesHeight < offset');
        //   return _totalSizesHeight - offset;
        // }
        // let itemsHeight = this.sizes.slice(0, _range.start).reduce((acc, cur) => acc + cur, 0);
        // for (let i = _range.start; i < _range.end; i++) {
        //   const h = this.sizes[i];
        //   if (itemsHeight === offset) {
        //     rowOver = i / this.colNum;
        //     break;
        //   } else if (itemsHeight > offset) {
        //     rowOver = Math.floor((i - 1) / this.colNum);
        //     break;
        //   } else {
        //     itemsHeight += h;
        //   }
        // }
        // this.rowOver = rowOver;
        // return rowOver;
      } // return a scroll offset from given index, can efficiency be improved more here?
      // although the call frequency is very high, its only a superposition of numbers

    }, {
      key: "getIndexOffset",
      value: function getIndexOffset(givenIndex) {
        if (!givenIndex) {
          return 0;
        } // // remember last calculate index


        this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
        this.lastCalcIndex = Math.min(this.lastCalcIndex, this.param.uniqueIds.length - 1);
        return this.sizes.slice(0, givenIndex).reduce(function (acc, cur) {
          return acc + cur;
        }); // let offset = 0;
        // let indexSize = 0;
        // for (let index = this.colNum - 1; index < givenIndex;) {
        //   indexSize = this.sizes[index];
        //   offset += (typeof indexSize === 'number' ? indexSize : this.getEstimateSize());
        //   index += this.colNum;
        // }
        // return offset;
      } // is fixed size type

    }, {
      key: "isFixedType",
      value: function isFixedType() {
        return this.calcType === CALC_TYPE.FIXED;
      } // in some conditions range is broke, we need correct it
      // and then decide whether need update to next range

    }, {
      key: "checkRange",
      value: function checkRange(start, end) {
        var keeps = this.param.keeps;
        var total = this.param.uniqueIds.length;
        end = Math.min(end, total);

        if (total === 0) {
          start = 0;
          end = 0;
        } else if (total <= keeps) {
          start = 0;
          end = total - 1;
        } else if (end - start < keeps - 1) {
          end = Math.min(start + keeps - 1, total - 1); // start = end - keeps + 1; old code
        }

        if (this.range.start !== start || this.range.end !== end) {
          this.updateRange(start, end);
        }
      } // setting to a new range and rerender

    }, {
      key: "updateRange",
      value: function updateRange(start, end) {
        this.range.start = start;
        this.range.end = end;
        this.range.padFront = this.getPadFront();
        this.range.padBehind = this.getPadBehind();
        this.callUpdate(this.getRange());
      } // return end base on start

    }, {
      key: "getEndByStart",
      value: function getEndByStart(start) {
        var theoryEnd = start + this.param.keeps - 1;
        return Math.min(theoryEnd, this.param.uniqueIds.length - 1);
      } // return total front offset

    }, {
      key: "getPadFront",
      value: function getPadFront() {
        if (this.isFixedType()) {
          return this.fixedSizeValue * (this.range.start / this.colNum);
        }

        return this.getIndexOffset(this.range.start);
      } // return total behind offset

    }, {
      key: "getPadBehind",
      value: function getPadBehind() {
        var end = this.range.end;
        var lastIndex = this.param.uniqueIds.length - 1;

        if (lastIndex + 1 === end) {
          return 0;
        }

        if (this.isFixedType()) {
          return Math.ceil((lastIndex - end) / this.colNum) * this.fixedSizeValue;
        } // if it's all calculated, return the exactly offset


        if (this.lastCalcIndex === lastIndex) {
          return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
        } // if not, use a estimated value


        return (lastIndex - end) * this.getEstimateSize();
      } // get the item estimate size

    }, {
      key: "getEstimateSize",
      value: function getEstimateSize() {
        if (this.isFixedType()) {
          return this.fixedSizeValue;
        }

        return this.param.estimateSize ? this.param.estimateSize : this.firstRangeAverageSize;
      }
    }]);

    return Virtual;
  }();

  /**
   * props declaration for default, item and slot component
   */
  var VirtualProps = {
    dataKey: {
      type: [String, Function],
      required: true
    },
    dataSources: {
      type: Array,
      required: true
    },
    scrollArea: [String, Object],
    keeps: {
      type: Number,
      "default": 30
    },
    estimateSize: {
      type: Number,
      "default": 0
    },
    // top 高度
    slotHeaderSize: {
      type: Number,
      "default": 0
    },
    // bottom 高度
    slotFooterSize: {
      type: Number,
      "default": 0
    },
    // 行间距
    lineInterval: {
      type: Number,
      "default": 0
    },
    direction: {
      type: String,
      "default": 'vertical' // the other value is horizontal

    },
    start: {
      type: Number,
      "default": 0
    },
    offset: {
      type: Number,
      "default": 0
    },
    topThreshold: {
      type: Number,
      "default": 0
    },
    bottomThreshold: {
      type: Number,
      "default": 0
    },
    pageMode: {
      type: Boolean,
      "default": false
    },
    rootTag: {
      type: String,
      "default": 'div'
    },
    wrapTag: {
      type: String,
      "default": 'div'
    },
    wrapClass: {
      type: String,
      "default": ''
    },
    wrapStyle: {
      type: Object
    },
    itemTag: {
      type: String,
      "default": 'div'
    },
    itemClass: {
      type: String,
      "default": ''
    },
    itemStyle: {
      type: Object
    },
    headerTag: {
      type: String,
      "default": 'div'
    },
    headerClass: {
      type: String,
      "default": ''
    },
    headerStyle: {
      type: Object
    },
    footerTag: {
      type: String,
      "default": 'div'
    },
    footerClass: {
      type: String,
      "default": ''
    },
    footerStyle: {
      type: Object
    }
  };
  var ItemProps = {
    index: {
      type: Number
    },
    event: {
      type: String
    },
    tag: {
      type: String
    },
    horizontal: {
      type: Boolean
    },
    source: {
      type: Object
    },
    uniqueKey: {
      type: [String, Number]
    }
  };
  var SlotProps = {
    event: {
      type: String
    },
    uniqueKey: {
      type: String
    },
    tag: {
      type: String
    },
    horizontal: {
      type: Boolean
    }
  };

  /**
   * item and slot component both use similar wrapper
   * we need to know their size change at any time
   */
  var Wrapper = {
    // data() {
    //   return {
    //     hasInitial: false,
    //   };
    // },
    created: function created() {
      this.shapeKey = this.horizontal ? 'offsetWidth' : 'offsetHeight';
    },
    mounted: function mounted() {
      var _this = this;

      // if (typeof ResizeObserver !== 'undefined') {
      //   this.resizeObserver = new ResizeObserver(() => {
      //     this.dispatchSizeChange();
      //   });
      //   this.resizeObserver.observe(this.$el);
      // }
      // this.dispatchSizeChange();
      var cycle = function cycle() {
        var offsetHeight = Math.ceil(_this.$el.offsetHeight);

        if (offsetHeight) {
          _this.dispatchSizeChange();
        } else {
          requestAnimationFrame(cycle);
        }
      };

      requestAnimationFrame(cycle);
    },
    // since componet will be reused, so disptach when updated
    updated: function updated() {
      this.dispatchSizeChange();
    },
    beforeDestroy: function beforeDestroy() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
    methods: {
      // tell parent current size identify by unqiue key
      dispatchSizeChange: function dispatchSizeChange() {
        // const widthOrHeight = this.$el ? this.$el[this.shapeKey] : 0;
        var offsetHeight = Math.ceil(this.$el.offsetHeight);
        var offsetLeft = Math.ceil(this.$el.offsetLeft);
        var offsetTop = Math.ceil(this.$el.offsetTop);
        this.$parent.$emit(this.event, this.uniqueKey, {
          index: this.index,
          offsetLeft: offsetLeft,
          offsetTop: offsetTop,
          offsetHeight: offsetHeight
        }); // this.hasInitial = true;
      }
    }
  }; // wrapping for item

  var Item = Vue.component('virtual-list-item', {
    mixins: [Wrapper],
    props: ItemProps,
    render: function render(h) {
      var tag = this.tag,
          index = this.index,
          source = this.source,
          uniqueKey = this.uniqueKey;
      var itemProps = {
        source: source,
        index: index,
        uniqueKey: uniqueKey
      };
      return h(tag, this.$scopedSlots["default"](itemProps));
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
    }
  }); // wrapping for slot

  var Slot = Vue.component('virtual-list-slot', {
    mixins: [Wrapper],
    props: SlotProps,
    render: function render(h) {
      var tag = this.tag,
          uniqueKey = this.uniqueKey;
      return h(tag, {
        key: uniqueKey,
        attrs: {
          role: uniqueKey
        }
      }, this.$slots["default"]);
    }
  });

  var EVENT_TYPE = {
    ITEM: 'item_resize',
    SLOT: 'slot_resize'
  };
  var SLOT_TYPE = {
    HEADER: 'thead',
    // string value also use for aria role attribute
    FOOTER: 'tfoot'
  };
  function dispatch(context, componentName, eventName) {
    var parent = context.$parent || context.$root;
    var name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.name;
      }
    }

    if (parent) {
      for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        rest[_key - 3] = arguments[_key];
      }

      // eslint-disable-next-line no-useless-call
      parent.$emit.apply(parent, [eventName].concat(rest));
    }
  }
  var VirtualList = Vue.component('virtual-list', {
    props: VirtualProps,
    data: function data() {
      return {
        range: null,
        scrollContainer: null,
        // 滚动区域
        preItemSize: {
          id: '',
          index: -1,
          left: null,
          top: null,
          height: 0
        },
        colNum: 0,
        // 一行的数量
        stopCalcuColNum: false,
        rendedItemCont: 0
      };
    },
    watch: {
      'dataSources.length': function dataSourcesLength() {
        this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources());
        this.virtual.handleDataSourcesChange();
      },
      keeps: function keeps(newValue) {
        this.virtual.updateParam('keeps', newValue);
        this.virtual.handleSlotSizeChange();
      },
      start: function start(newValue) {
        this.scrollToIndex(newValue);
      },
      offset: function offset(newValue) {
        this.scrollToOffset(newValue);
      }
    },
    created: function created() {
      this.isHorizontal = this.direction === 'horizontal';
      this.directionKey = this.isHorizontal ? 'scrollLeft' : 'scrollTop';
      this.installVirtual(); // listen item size change

      this.$on(EVENT_TYPE.ITEM, this.onItemResized); // listen slot size change

      if (this.$slots.header || this.$slots.footer) {
        this.$on(EVENT_TYPE.SLOT, this.onSlotResized);
      }
    },
    // set back offset when awake from keep-alive
    activated: function activated() {
      this.scrollToOffset(this.virtual.offset);
    },
    mounted: function mounted() {
      // 滚动区域
      var scrollContainer = null;

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
          passive: true
        });
        this.scrollContainer = scrollContainer;
      } else {
        console.error("\ncan't find scroll element by ".concat(this.$props.scrollArea));
      }

      if (this.pageMode) {
        this.updatePageModeFront();
      } // set position


      if (this.start) {
        this.scrollToIndex(this.start);
      } else if (this.offset) {
        this.scrollToOffset(this.offset);
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.virtual.destroy();
      this.scrollContainer.removeEventListener('scroll', this.onScroll, {
        passive: true
      });
    },
    methods: {
      getIndexOffset: function getIndexOffset(index) {
        return this.virtual.getIndexOffset(index);
      },
      getItemsRendFinish: function getItemsRendFinish() {
        return this.virtual.getItemsRendFinish();
      },
      // return current scroll offset
      getOffset: function getOffset() {
        if (this.pageMode) {
          return document.documentElement[this.directionKey] || document.body[this.directionKey];
        }

        return Math.ceil(this.scrollContainer[this.directionKey]);
      },
      // return client viewport size
      getClientSize: function getClientSize() {
        var key = this.isHorizontal ? 'clientWidth' : 'clientHeight';

        if (this.scrollContainer === document) {
          return document.documentElement[key] || document.body[key];
        }

        return Math.ceil(this.scrollContainer[key]);
      },
      // return all scroll size
      getScrollSize: function getScrollSize() {
        var key = this.isHorizontal ? 'scrollWidth' : 'scrollHeight';

        if (this.scrollContainer === document) {
          return document.documentElement[key] || document.body[key];
        }

        return Math.ceil(this.scrollContainer[key]);
      },
      // set current scroll position to a expectant offset
      scrollToOffset: function scrollToOffset(offset) {
        if (this.pageMode) {
          document.body[this.directionKey] = offset;
          document.documentElement[this.directionKey] = offset;
        } else {
          this.scrollContainer[this.directionKey] = offset;
        }
      },
      // set current scroll position to a expectant index
      scrollToIndex: function scrollToIndex(index) {
        // scroll to bottom
        if (index >= this.dataSources.length - 1) {
          this.scrollToBottom();
        } else {
          var offset = this.virtual.getOffset(index);
          this.scrollToOffset(offset);
        }
      },
      // set current scroll position to bottom
      scrollToBottom: function scrollToBottom() {
        var _this = this;

        var shepherd = this.$refs.shepherd;

        if (shepherd) {
          var offset = shepherd[this.isHorizontal ? 'offsetLeft' : 'offsetTop'];
          this.scrollToOffset(offset); // check if it's really scrolled to the bottom
          // maybe list doesn't render and calculate to last range
          // so we need retry in next event loop until it really at bottom

          setTimeout(function () {
            if (_this.getOffset() + _this.getClientSize() < _this.getScrollSize()) {
              _this.scrollToBottom();
            }
          }, 3);
        }
      },
      // when using page mode we need update slot header size manually
      // taking root offset relative to the browser as slot header size
      updatePageModeFront: function updatePageModeFront() {
        var rootEle = this.$el;

        if (rootEle) {
          var rect = rootEle.getBoundingClientRect();
          var defaultView = rootEle.ownerDocument.defaultView; // pageXOffset pageYOffset

          var offsetFront = this.isHorizontal ? rect.left + defaultView.scrollX : rect.top + defaultView.scrollY;
          this.virtual.updateParam('slotHeaderSize', offsetFront);
        }
      },
      // reset all state back to initial
      reset: function reset() {
        this.virtual.destroy();
        this.scrollToOffset(0);
        this.installVirtual();
      },
      // ----------- public method end -----------
      installVirtual: function installVirtual() {
        this.virtual = new Virtual({
          slotHeaderSize: this.slotHeaderSize,
          slotFooterSize: this.slotFooterSize,
          keeps: this.keeps,
          estimateSize: this.estimateSize,
          buffer: 1,
          // 缓存行数
          uniqueIds: this.getUniqueIdFromDataSources()
        }, this.onRangeChanged); // sync initial range

        this.range = this.virtual.getRange();
      },
      getUniqueIdFromDataSources: function getUniqueIdFromDataSources() {
        var dataKey = this.dataKey;
        return this.dataSources.map(function (dataSource) {
          return typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];
        });
      },
      // event called when each item mounted or size changed
      onItemResized_back: function onItemResized_back(id, index, _ref) {
        var offsetLeft = _ref.offsetLeft,
            offsetTop = _ref.offsetTop,
            offsetHeight = _ref.offsetHeight;
        var preItemSize = this.$data.preItemSize;

        if (preItemSize.left === null) {
          this.preItemSize.left = offsetLeft;
        }

        if (preItemSize.left === offsetLeft && preItemSize.id && id !== preItemSize.id) {
          // 每行的高度, 包括margin
          var overRow = Math.ceil((index + 1) / this.colNum) - Math.ceil((preItemSize.index + 1) / this.colNum);

          if (index > preItemSize.index && overRow < 2) {
            var preOffsetHeight = offsetTop - preItemSize.top; // console.log(`\npreInd:${preItemSize.index}  index:${index} %ch: ${preOffsetHeight}`, 'color:red');
            // 每行最后一项的size

            preOffsetHeight && this.virtual.saveSize(preItemSize.index, preOffsetHeight);
            this.stopCalcuColNum = true;
            var newKeeps = Math.ceil(this.keeps / this.colNum) * this.colNum;

            if (newKeeps !== this.keeps) {
              this.virtual.updateParam('keeps', newKeeps);
            } // this.$emit('resized', preItemSize.id, preOffsetHeight);

          } else if (index < preItemSize.index) {
            console.log('\n**********向上**********\n');
          } else {
            console.error('\nonItemResized error!');
          }
        } else if (!this.stopCalcuColNum && id !== preItemSize.id) {
          this.colNum++;
        }

        this.preItemSize = {
          index: index,
          id: id,
          left: this.preItemSize.left,
          top: offsetTop,
          height: offsetHeight
        }; // if (index === this.range.end) {
        //   this.virtual.saveSize(id, offsetHeight);
        //   this.stopCalcuColNum = true;
        // }
      },
      onItemResized: function onItemResized(id, _ref2) {
        var index = _ref2.index,
            offsetLeft = _ref2.offsetLeft,
            offsetTop = _ref2.offsetTop,
            offsetHeight = _ref2.offsetHeight;
        var rowHeight = offsetHeight + this.$props.lineInterval;
        var preItemSize = this.$data.preItemSize; // range item mounted

        id !== preItemSize.id && this.rendedItemCont++;
        var N = Math.min(this.dataSources.length, this.keeps);

        if (this.rendedItemCont === N) {
          this.virtual.rendFinish(this.colNum);
        }

        if (preItemSize.left === null) {
          this.preItemSize.left = offsetLeft;
        }

        if (preItemSize.left === offsetLeft && preItemSize.id && id !== preItemSize.id) {
          // 每行的高度, 包括margin
          // const preOffsetHeight = offsetTop - preItemSize.top;
          // console.log(`\npreInd:${preItemSize.index}  index:${index} %ch: ${preItemSize.height}`, 'color:red');
          if (!this.stopCalcuColNum) {
            var newKeeps = Math.ceil(this.keeps / this.colNum) * this.colNum;

            if (newKeeps !== this.keeps) {
              this.virtual.updateParam('keeps', newKeeps);
            }
          } // 每行最后一项的size


          this.virtual.saveSize(preItemSize.index, preItemSize.height);
          this.$emit('resized', preItemSize.id, preItemSize.height);
          this.stopCalcuColNum = true; // const overRow = Math.ceil((index + 1) / this.colNum) - Math.ceil((preItemSize.index + 1) / this.colNum);
          // if (index > preItemSize.index && overRow < 2) {
          // }
        } else if (!this.stopCalcuColNum && id !== preItemSize.id) {
          this.colNum++;
        }

        this.preItemSize = {
          index: index,
          id: id,
          left: this.preItemSize.left,
          top: offsetTop,
          height: rowHeight
        };
      },
      // event called when slot mounted or size changed
      onSlotResized: function onSlotResized(type, size, hasInit) {
        if (type === SLOT_TYPE.HEADER) {
          this.virtual.updateParam('slotHeaderSize', size.offsetHeight);
        } else if (type === SLOT_TYPE.FOOTER) {
          this.virtual.updateParam('slotFooterSize', size.offsetHeight);
        } // if (hasInit) {
        //   this.virtual.handleSlotSizeChange();
        // }

      },
      // here is the rerendering entry
      onRangeChanged: function onRangeChanged(range) {
        this.range = range;
      },
      onScroll: function onScroll(evt) {
        var _this2 = this;

        requestAnimationFrame(function () {
          var offset = _this2.getOffset();

          var clientSize = _this2.getClientSize();

          var scrollSize = _this2.getScrollSize(); // iOS scroll-spring-back behavior will make direction mistake


          if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
            return;
          }

          _this2.virtual.handleScroll(offset);

          _this2.emitEvent(offset, clientSize, scrollSize, evt);
        });
      },
      // emit event in special position
      emitEvent: function emitEvent(offset, clientSize, scrollSize, evt) {
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
      getRenderSlots: function getRenderSlots(h) {
        var dataKey = this.dataKey,
            dataSources = this.dataSources;
        var _this$range = this.range,
            start = _this$range.start,
            end = _this$range.end;
        var slots = [];
        console.log('\n%crender!%c start: %d end: %d\n', 'color:red', '', start, end);

        if (end <= start || dataSources.length === 0) {
          return [];
        } // const slotComponent = this.$scopedSlots.item;


        for (var index = start; index <= end; index++) {
          var dataSource = dataSources[index];

          if (dataSource) {
            var uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];

            if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
              slots.push(h(Item, {
                key: uniqueKey,
                // 是否复用dom？
                props: {
                  index: index,
                  uniqueKey: uniqueKey,
                  source: dataSource,
                  event: EVENT_TYPE.ITEM,
                  tag: this.$props.itemTag,
                  horizontal: this.isHorizontal
                },
                "class": 'virtual-list-item ' + (this.$props.itemClass || ''),
                style: this.$props.itemStyle,
                attrs: {
                  index: index,
                  role: 'listotem'
                },
                scopedSlots: {
                  "default": this.$scopedSlots.item
                }
              }));
            } else {
              console.error("Cannot get the data-key '".concat(dataKey, "' from data-sources."));
            }
          } else {
            console.error("Cannot get the index '".concat(index, "' from data-sources."));
          }
        }

        return slots;
      }
    },
    // render function, a closer-to-the-compiler alternative to templates
    // https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth
    render: function render(h) {
      var _this$$slots = this.$slots,
          header = _this$$slots.header,
          footer = _this$$slots.footer;
      var _this$range2 = this.range,
          padFront = _this$range2.padFront,
          padBehind = _this$range2.padBehind;
      var isHorizontal = this.isHorizontal;
      var paddingStyle = {
        padding: isHorizontal ? "0px ".concat(padBehind, "px 0px ").concat(padFront, "px") : "".concat(padFront, "px 0px ").concat(padBehind, "px")
      };
      var wrapperStyle = this.wrapStyle ? _objectSpread2({}, this.wrapStyle, {}, paddingStyle) : paddingStyle;
      return h(this.rootTag, {
        ref: 'root' // on: { '&scroll': !this.pageMode && this.onScroll },

      }, [// header slot
      header ? h(Slot, {
        "class": this.headerClass,
        style: this.headerStyle,
        props: {
          tag: this.headerTag,
          event: EVENT_TYPE.SLOT,
          uniqueKey: SLOT_TYPE.HEADER
        }
      }, header) : null, // main list
      h(this.wrapTag, {
        "class": this.wrapClass,
        attrs: {
          role: 'group'
        },
        style: wrapperStyle
      }, this.getRenderSlots(h)), // footer slot
      footer ? h(Slot, {
        "class": this.footerClass,
        style: this.footerStyle,
        props: {
          tag: this.footerTag,
          event: EVENT_TYPE.SLOT,
          uniqueKey: SLOT_TYPE.FOOTER
        }
      }, footer) : null, // an empty element use to scroll to bottom
      h('div', {
        ref: 'shepherd',
        style: {
          width: isHorizontal ? '0px' : '100%',
          height: isHorizontal ? '100%' : '0px'
        }
      })]);
    }
  });

  exports.default = VirtualList;
  exports.dispatch = dispatch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
