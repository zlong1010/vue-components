/**
 * props declaration for default, item and slot component
 */

export const VirtualProps = {
  dataKey: {
    type: [String, Function],
    required: true,
  },
  dataSources: {
    type: Array,
    required: true,
  },
  scrollArea: [String, Object],
  // 页面维持的dom数
  keeps: {
    type: Number,
    default: 12,
  },
  estimateSize: {
    type: Number,
    default: 0,
  },
  // top 高度
  slotHeaderSize: {
    type: Number,
    default: 0,
  },
  // bottom 高度
  slotFooterSize: {
    type: Number,
    default: 0,
  },
  // 行间距
  lineInterval: {
    type: Number,
    default: 0,
  },
  // direction: {
  //   type: String,
  //   default: 'vertical', // the other value is horizontal
  // },
  start: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  topThreshold: {
    type: Number,
    default: 0,
  },
  bottomThreshold: {
    type: Number,
    default: 0,
  },
  pageMode: {
    type: Boolean,
    default: false,
  },
  rootTag: {
    type: String,
    default: 'div',
  },
  wrapTag: {
    type: String,
    default: 'div',
  },
  wrapClass: {
    type: String,
    default: '',
  },
  wrapStyle: {
    type: Object,
  },
  itemTag: {
    type: String,
    default: 'div',
  },
  itemClass: {
    type: String,
    default: '',
  },
  itemStyle: {
    type: Object,
  },
  headerTag: {
    type: String,
    default: 'div',
  },
  headerClass: {
    type: String,
    default: '',
  },
  headerStyle: {
    type: Object,
  },
  footerTag: {
    type: String,
    default: 'div',
  },
  footerClass: {
    type: String,
    default: '',
  },
  footerStyle: {
    type: Object,
  },
};

export const ItemProps = {
  index: {
    type: Number,
  },
  event: {
    type: String,
  },
  tag: {
    type: String,
  },
  horizontal: {
    type: Boolean,
  },
  source: {
    type: Object,
  },
  uniqueKey: {
    type: [String, Number],
  },
};

export const SlotProps = {
  event: {
    type: String,
  },
  uniqueKey: {
    type: String,
  },
  tag: {
    type: String,
  },
  horizontal: {
    type: Boolean,
  },
};
