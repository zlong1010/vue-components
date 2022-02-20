import DebugBox from './debug';

const Log = true;

const DIRECTION_TYPE = {
  FRONT: 'FRONT', // scroll up or left
  BEHIND: 'BEHIND', // scroll down or right
};
const CALC_TYPE = {
  INIT: 'INIT',
  FIXED: 'FIXED',
  DYNAMIC: 'DYNAMIC',
};
const LEADING_BUFFER = 0;

export default class Virtual {
  constructor(param, callUpdate) {
    Log && console.log('\ninit virtual');
    this.init(param, callUpdate);
  }

  init(param, callUpdate) {
    // param data
    this.param = param;
    this.callUpdate = callUpdate;

    let N = 0;
    if (param) {
      N = param.uniqueIds.length;
    }
    this.sizes = Array(N).fill(0);
    this.firstRangeAverageSize = 0;
    this.lastCalcIndex = 0;
    this.fixedSizeValue = 0;
    this.calcType = CALC_TYPE.INIT;
    this.colNum = 0;
    this.isRendFinish = false; // 所有的item渲染完成

    // scroll data
    this.offset = 0;
    this.direction = '';

    // range data
    this.range = Object.create(null);
    if (param) {
      this.checkRange(0, param.keeps - 1);
    }

    const fn = () => {
      DebugBox.updateText({
        colNum: this.colNum,
        buffer: this.param.buffer,
        keeps: this.param.keeps,
        N: this.param.uniqueIds.length,
        rowOver: this.rowOver,
        size: this.sizes,
      });
      requestAnimationFrame(fn);
    };
    Log && requestAnimationFrame(fn);
  }

  destroy() {
    this.init(null, null);
  }

  // in some special situation (e.g. length change) we need to update in a row
  // try goiong to render next range by a leading buffer according to current direction
  handleDataSourcesChange() {
    let { start } = this.range;

    if (this.isFront()) {
      start -= LEADING_BUFFER;
    } else if (this.isBehind()) {
      start += LEADING_BUFFER;
    }

    start = Math.max(start, 0);
    this.updateRange(this.range.start, this.getEndByStart(start));
  }

  // when slot size change, we also need force update
  handleSlotSizeChange() {
    this.handleDataSourcesChange();
  }

  // calculating range on scroll
  handleScroll(offset) {
    this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
    this.offset = offset;
    if (!this.param) {
      return;
    }
    if (this.isFront()) {
      this.handleFront();
    } else if (this.isBehind()) {
      // 向下滚动
      this.handleBehind();
    }
  }
  // 向上滚动
  handleFront() {
    if (this.range.start === 0) {
      return;
    }
    const overs = this.getScrollOvers('front');
    // should not change range if start doesn't exceed overs
    if (overs * this.colNum >= this.range.start + this.colNum) {
      return;
    }
    const start = Math.max(overs - this.param.buffer, 0) * this.colNum;
    console.debug({ overs, start });
    this.checkRange(start, this.getEndByStart(start));
  }
  // 向下滚动
  handleBehind() {
    if (this.range.end === this.getTotalNum() - 1) {
      return;
    }
    // start 滚动over的行数
    const overs = this.getScrollOvers('behind');
    // range should not change if scroll overs within buffer
    if (overs * this.colNum < this.range.start + this.param.buffer * this.colNum) {
      return;
    }
    this.checkRange(overs * this.colNum, this.getEndByStart(overs * this.colNum));
  }
  /**
   * 功能: 向下滚动了多少行, 更新this.rowOver
   * 参数: direction
   * @returns 滚动的行数
   */
  getScrollOvers() {
    // offset: scrollTop
    const offset = this.offset - this.param.slotHeaderSize;
    // 第一行高度
    const _idx = this.sizes.findIndex(v => !!v);
    const firstRowHeight = _idx !== -1 ? this.sizes[_idx] : 0;
    if (offset <= 0 || !firstRowHeight || offset < firstRowHeight) {
      this.rowOver = 0;
      return 0;
    }

    // 固定高度
    if (this.isFixedType()) {
      this.rowOver = Math.floor(offset / this.fixedSizeValue);
      return this.rowOver;
    }

    // 动态高度
    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.getTotalNum();
    const _range = this.range;
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
    // 1.8行设置为1行
    this.rowOver = low > 0 ? --low : 0;
    return this.rowOver;
  }

  checkRange(start, end) {
    const _keeps = this.param.keeps;
    const total = this.getTotalNum();
    end = Math.min(end, total);
    if (total === 0) {
      start = 0;
      end = 0;
    } else if (total <= _keeps) {
      start = 0;
      end = total - 1;
    } else if (end - start < _keeps - 1) {
      end = Math.min(start + _keeps - 1, total - 1);
      // start = end - _keeps + 1; old code
    }
    if (this.range.start !== start || this.range.end !== end) {
      this.updateRange(start, end);
    }
  }

  /**
   * 更新range并调用回调触发re-render
   * 计算padFront、padBehind
   */
  updateRange(start, end) {
    this.range.start = start;
    this.range.end = end;
    this.range.padFront = this.getPadFront();
    this.range.padBehind = this.getPadBehind();
    this.callUpdate(this.getRange());
  }

  // total front offset
  getPadFront() {
    if (this.isFixedType()) {
      return this.fixedSizeValue * (this.range.start / this.colNum);
    }
    return this.getIndexOffset(this.range.start);
  }

  // return total behind offset
  getPadBehind() {
    const { end } = this.range;
    const lastIndex = this.getTotalNum() - 1;
    if (lastIndex + 1 === end) {
      return 0;
    }
    if (this.isFixedType()) {
      return Math.ceil((lastIndex - end) / this.colNum) * this.fixedSizeValue;
    }

    // if it's all calculated, return the exactly offset
    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
    }
    // if not, use a estimated value
    return (lastIndex - end) * this.getEstimateSize();
  }
  
  // ----------- 工具函数 -----------
  // 第一次 range item mounted
  rendFinish(colNum) {
    this.isRendFinish = true;
    const _range = this.range;
    this.colNum = colNum;
    // 更新缓存buffer
    this.param.buffer = Math.max(Math.round(this.param.keeps / (colNum * 3)), 1);
    // 设置平均值
    const arr = this.sizes.slice(_range.start, _range.end+1).filter((_,idx) => !((idx+1)%colNum));
    const totalHeight = arr.reduce((acc, val) => acc + val, 0);
    this.firstRangeAverageSize = Math.round((totalHeight * colNum) / (_range.end - _range.start + 1));
    this.fillSizeByEstiSize();
    // 更新pading
    this.handleDataSourcesChange();
    return this.firstRangeAverageSize;
  }

  getIndexOffset(givenIndex) {
    if (!givenIndex) {
      return 0;
    }
    // // remember last calculate index
    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getTotalNum() - 1);
    const arr = this.sizes.slice(0, givenIndex).filter((_,idx) => !((idx+1)%this.colNum));
    return arr.reduce((acc, cur) => acc + cur, 0);
  }
  // return end base on start
  getEndByStart(start) {
    const theoryEnd = start + this.param.keeps - 1;
    return Math.min(theoryEnd, this.getTotalNum() - 1);
  }
  // return current render range
  getRange() {
    const range = Object.create(null);
    range.start = this.range.start;
    range.end = this.range.end;
    range.padFront = this.range.padFront;
    range.padBehind = this.range.padBehind;
    return range;
  }
  // return start index offset
  getOffset(start) {
    return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
  }

  fillSizeByEstiSize() {
    this.sizes.forEach((v, ind) => {
      if ((ind + 1) % this.colNum === 0 && v === 0) {
        this.sizes[ind] = this.getEstimateSize();
      }
    });
  }

  // get the item estimate size
  getEstimateSize() {
    if (this.isFixedType()) {
      return this.fixedSizeValue;
    }
    return this.param.estimateSize ? this.param.estimateSize : this.firstRangeAverageSize;
  }

  getItemsRendFinish() {
    return this.isRendFinish;
  }

  // is fixed size type
  isFixedType() {
    return this.calcType === CALC_TYPE.FIXED;
  }

  updateParam(key, value) {
    if (this.param && key in this.param) {
      this.param[key] = value;
      if (key === 'uniqueIds') {
        const preNum = this.sizes.length;
        if (value.length > preNum) {
          this.sizes = this.sizes.concat(Array(value.length - preNum).fill(0));
          this.fillSizeByEstiSize();
        }
      } else if (key === 'keeps') {
        this.checkRange(this.range.start, this.range.end);
      }
    }
  }

  // save each size map by index
  saveSize(idx, size) {
    this.sizes[idx] = size;
    if (this.calcType === CALC_TYPE.INIT) {
      this.fixedSizeValue = size;
      this.calcType = CALC_TYPE.FIXED;
    } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
      this.calcType = CALC_TYPE.DYNAMIC;
      this.fixedSizeValue = 0;
    }
  }

  isBehind() {
    return this.direction === DIRECTION_TYPE.BEHIND;
  }

  isFront() {
    return this.direction === DIRECTION_TYPE.FRONT;
  }
  // 总items数量
  getTotalNum() {
    return this.param.uniqueIds.length;
  }
}
