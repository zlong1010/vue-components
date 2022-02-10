/* eslint-disable */

class Debug {
  constructor() {
    if (document.querySelector('#debugger')) {
      return;
    }
    const targetDom = document.createElement('div');
    targetDom.setAttribute('id', 'debugger');
    const initStyleObj = {
      width: '200px',
      height: '100%',
      outline: '1px solid red',
      position: 'fixed',
      'background-color': '#fff',
      right: '10px',
      top: '10px',
      'font-size': '12px',
      'line-height': 1.5,
      'white-space': 'pre',
      'z-index': 1111111,
      cursor: 'default',
      transform: 'translate(0, 0)',
    };
    targetDom.setAttribute('style', Debug.styleObjToStr(initStyleObj));
    document.body.appendChild(targetDom);
    // content
    const contentEle = document.createElement('div');
    contentEle.setAttribute(
      'style',
      Debug.styleObjToStr({
        width: '100%',
        height: '100%',
        overflow: 'scroll',
      }),
    );
    targetDom.appendChild(contentEle);
    this.contentEle = contentEle;

    this.target = targetDom;
    this.isMoving = false;
    this.resizeDirection = '';
    targetDom.addEventListener('mousedown', e => this.handleMouseDown(e));
    document.addEventListener('mousemove', e => this.handleMouseMove(e));
    document.addEventListener('mouseup', e => this.handleMouseUp(e));

    this.initMaxBtn();
    this.initCopyBtn();
    this.initCloseBtn();
  }
  // 最大化
  initMaxBtn() {
    const targetDom = this.target;
    const maxBtn = document.createElement('div');
    maxBtn.setAttribute(
      'style',
      Debug.styleObjToStr({
        width: '16px',
        height: '16px',
        position: 'fixed',
        top: '10px',
        right: '32px',
        cursor: 'pointer',
        border: '1px solid blue',
      }),
    );
    maxBtn.setAttribute('data-type', 'normal');
    targetDom.appendChild(maxBtn);
    let preRect = null;
    maxBtn.addEventListener('click', e => {
      const eleRect = targetDom.getBoundingClientRect();
      if (e.target.getAttribute('data-type') === 'normal') {
        e.target.setAttribute('data-type', 'max');
        preRect = eleRect;
        targetDom.style.left = '0px';
        targetDom.style.top = '0px';
        targetDom.style.right = 'auto';
        targetDom.style.bottom = 'auto';
        targetDom.style.width = '100%';
        targetDom.style.height = '100%';
      } else {
        e.target.setAttribute('data-type', 'normal');
        targetDom.style.left = preRect.left + 'px';
        targetDom.style.top = preRect.top + 'px';
        targetDom.style.right = 'auto';
        targetDom.style.bottom = 'auto';
        targetDom.style.width = preRect.width + 'px';
        targetDom.style.height = preRect.height + 'px';
      }
    });
  }
  initCopyBtn() {
    const targetDom = this.target;
    const copyEle = document.createElement('div');
    copyEle.setAttribute(
      'style',
      Debug.styleObjToStr({
        height: '16px',
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        cursor: 'pointer',
        border: '1px solid blue',
      }),
    );
    copyEle.textContent = '复制';
    targetDom.appendChild(copyEle);
    copyEle.addEventListener('click', () => {
      Debug.copyString(this.contentEle.textContent);
    });
  }
  initCloseBtn() {
    const targetDom = this.target;
    const copyEle = document.createElement('div');
    copyEle.setAttribute(
      'style',
      Debug.styleObjToStr({
        height: '16px',
        width: '16px',
        position: 'fixed',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        border: '1px solid blue',
        'text-align': 'center',
      }),
    );
    copyEle.textContent = 'X';
    targetDom.appendChild(copyEle);
    copyEle.addEventListener('click', () => {
      targetDom.style.display = 'none';
    });
  }
  show() {
    this.target.style.display = 'block';
  }
  // 按下鼠标
  handleMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    const direction = this.getResizeDirection(e);
    this.resizeDirection = direction;
    if (direction) {
      this.isMoving = false;
    } else {
      this.isMoving = true;
      this.mouseOffsetX = this.target.offsetLeft - e.clientX;
      this.mouseOffsetY = this.target.offsetTop - e.clientY;
    }
  }
  // 移动鼠标
  handleMouseMove(e) {
    const mouseCoor = { x: e.clientX, y: e.clientY };
    const targetEle = this.target;
    // 拖拽
    if (this.isMoving) {
      const lastX = mouseCoor.x + this.mouseOffsetX;
      const lastY = mouseCoor.y + this.mouseOffsetY;
      targetEle.style.left = lastX + 'px';
      targetEle.style.top = lastY + 'px';
      targetEle.style.right = 'auto';
      targetEle.style.bottom = 'auto';
      return;
    }
    // resize
    const direction = this.resizeDirection;
    const eleRect = targetEle.getBoundingClientRect();
    const viewportClient = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
    const styleRect = {
      top: eleRect.top,
      right: viewportClient.width - eleRect.right,
      bottom: viewportClient.height - eleRect.bottom,
      left: eleRect.left,
    };
    if (direction) {
      targetEle.style.width = 'auto';
      targetEle.style.height = 'auto';
    }
    if (direction === 'topLeft') {
      targetEle.style.top = `${mouseCoor.y}px`;
      targetEle.style.right = `${styleRect.right}px`;
      targetEle.style.bottom = styleRect.bottom + 'px';
      targetEle.style.left = mouseCoor.x + 'px';
    } else if (direction === 'topRight') {
      targetEle.style.top = mouseCoor.y + 'px';
      targetEle.style.right = viewportClient.width - mouseCoor.x + 'px';
      targetEle.style.bottom = styleRect.bottom + 'px';
      targetEle.style.left = styleRect.left + 'px';
    } else if (direction === 'bottomLeft') {
      targetEle.style.top = styleRect.top + 'px';
      targetEle.style.right = styleRect.right + 'px';
      targetEle.style.bottom = viewportClient.height - mouseCoor.y + 'px';
      targetEle.style.left = mouseCoor.x + 'px';
    } else if (direction === 'bottomRight') {
      targetEle.style.top = styleRect.top + 'px';
      targetEle.style.right = viewportClient.width - mouseCoor.x + 'px';
      targetEle.style.bottom = viewportClient.height - mouseCoor.y + 'px';
      targetEle.style.left = styleRect.left + 'px';
    }
    const direction2 = this.getResizeDirection(e);
    if (['topLeft', 'bottomRight'].includes(direction2)) {
      this.target.style.cursor = 'nwse-resize';
    } else if (['topRight', 'bottomLeft'].includes(direction2)) {
      this.target.style.cursor = 'nesw-resize';
    } else {
      this.target.style.cursor = 'default';
    }
  }
  // 释放鼠标
  handleMouseUp(e) {
    this.isMoving = false;
    this.resizeDirection = '';
    this.mouseOffsetX = 0;
    this.mouseOffsetY = 0;
    const targetEle = this.target;
    const eleRect = targetEle.getBoundingClientRect();
    targetEle.style.width = eleRect.width + 'px';
    targetEle.style.height = eleRect.height + 'px';
    targetEle.style.right = 'auto';
    targetEle.style.bottom = 'auto';
  }
  updateText(data = '') {
    let text = '';
    if (typeof data === 'string') {
      text = data;
    } else if (Array.isArray(data)) {
      data.forEach((v, ind) => {
        text += `${ind}: ${v}\n`;
      });
    } else {
      text = JSON.stringify(data, null, 2);
    }
    this.contentEle.textContent = text;
  }
  getResizeDirection(e) {
    const mouseCoordinate = { x: e.clientX, y: e.clientY };
    const eleRect = this.target.getBoundingClientRect();
    // 4个角
    const angles = {};
    angles.topLeft = {
      x: eleRect.left,
      y: eleRect.top,
    };
    angles.topRight = {
      x: eleRect.right,
      y: eleRect.top,
    };
    angles.bottomLeft = {
      x: eleRect.left,
      y: eleRect.bottom,
    };
    angles.bottomRight = {
      x: eleRect.right,
      y: eleRect.bottom,
    };
    const keys = Object.keys(angles);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const d = Math.abs(mouseCoordinate.x - angles[k].x) + Math.abs(mouseCoordinate.y - angles[k].y);
      if (d < 40) {
        return k;
      }
    }
    return '';
  }
  static styleObjToStr(obj) {
    const keys = Object.keys(obj);
    const tmpArr = [];
    keys.forEach(k => {
      tmpArr.push(`${k}:${obj[k]}`);
    });
    return tmpArr.join(';');
  }
  // 复制
  static copyString(str) {
    const input = document.createElement('textarea');
    input.readOnly = 'readonly';
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    input.value = str;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

const DebugBox = new Debug();
window.DebugBox = DebugBox;
export default DebugBox;
