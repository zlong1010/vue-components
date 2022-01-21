/**
 * 局部loading指令
 * 包含背景模糊和loading动画
 * value: {
 *   isLoading: bool, 是否显示
 *   isBlur: bool 是否模糊
 *   modal bool: 是否是modal弹窗
 *   title: string
 *   icon: string loading 显示的icon
 * }
*/

// 默认参数
const defaultParam = {
  title: '加载中...',
  isBlur: true,
  isModal: false,
  icon: 'icon_loading_circle',
};

/******************************************************************/
export default {
  inserted(el, binding) {
    doLoading(el, binding);
  },
  update(el, binding) {
    doLoading(el, binding);
  },
};

function doLoading(el, binding) {
  const params = { ...defaultParam, ...binding.value };
  params.isLoading ? insertHtmlAfterParent(el, params) : removeLoadingDom(el);
}

function removeLoadingDom(parantEle) {
  if (parantEle) {
    const ele = parantEle.querySelector('.g-loading-wrap');
    ele && ele.remove();
  }
}

function insertHtmlAfterParent(el, params) {
  const loadingEle = el.querySelector('.g-page-loading.dynamic');
  if (loadingEle) {
    return;
  }
  // 通过获取元素距离顶部的就像素与屏幕高度，相减求出遮罩层高度
  // 若元素距离视窗底部为负数，即代表元素高度超出可视区域，直接使用元素高度作为遮罩层高度
  const elRectInfo = el.getBoundingClientRect();
  const screenHeight = document.documentElement.clientHeight;
  let boxHeight = el.clientHeight;
  const boxWidth = el.clientWidth;
  if (elRectInfo.bottom > 0) {
    boxHeight = screenHeight - elRectInfo.top;
  }
  const { isModal } = params;
  if (isModal) {
    if (typeof isModal === 'boolean') {
      boxHeight = el.clientHeight;
    } else {
      const box = document.querySelector(isModal);
      boxHeight = box.clientHeight - elRectInfo.top + box.getBoundingClientRect().top - 10;
    }
  }
  const html = `
    <div class="g-loading-wrap${params.isBlur ? ' g-page-bgfilter' : ''}"
      style="height:${boxHeight}px;width:${boxWidth}px">
      <div class="g-page-loading dynamic">
        <div class="inner">
          <div class="${params.icon}"></div>
          <div class="txt">
            <div class="title">${xssH(params.title)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  el.insertAdjacentHTML('afterbegin', html);
}

const __xssMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
};

// 针对普通文本的编码
function xssH(s) {
  s += '';
  if (/(?:&|<|>|"|'|`)/.test(s) === false) {
    return s;
  }
  return s.replace(/(?:&|<|>|"|'|`)/g, (match) => __xssMap[match]);
}

/* v-loading 指令样式
@keyframes loop-rotate {
  0% {
    transform: rotate(-360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.g-loading-wrap{
  position: fixed;
  background-color: rgba(0,0,0,0);
  z-index: 100000000000;
  .g-page-loading {
    position: absolute;
    width: 280px;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 8px;
    z-index: 100000000000;
    .inner {
      text-align: center;
      .icon_loading_circle {
        height: 48px;
        width: 48px;
        margin: auto;
        animation: loop-rotate 1s linear infinite;
        display: inline-block;
        width: 48px;
        height: 48px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAdVBMVEUAAABVXv8+VuM7UeE6UeE6UuE6UeA7UuE6UuE7U+M6UuE6UeE7U+E7UuI7UuI9VONBXeNGYO06UeE7UeE6UuFAU+Y7UeE7UeA6U+E7UeE8U+I7VuU+U+Q6VeQ7UeA6UeE6UeE7UeE8UuA7UuA8U+M+VOA6UeByMY5aAAAAJnRSTlMABCDFpvngoZxP7PN1bUYsEgnSyuUd3beIhFkmGDnZubOKfGM3OrUXAeoAAAMaSURBVGje1dvZmqIwEAXgSlhC2EFURGjbpev9H3FurJCWGa8mp7/+XyAGs1QqFfo9VGNLc4n6NE+GeE8Y+h4fEvbkgJa7KUt5I6bAalPw3wwUkh4HFsCGzyZhAfzUTcwbgME1v2022HRSVcFbeZSV9qvRraJAlp5fHbJppsDUlV/sKk3h7SP+Jj2dCcHm3ztrCWNkX1QThjLs+agJpDvyqrh1BNLueHXUhNL27CQlwXRef9MHwSjv//1sCcewkynCGdk5EZBlpyKgff4z7aoI/J3FdR1XhLSs80gRkOrdutESUuXWyQchzS6uKwkqdvsRQTVu/9WEtHb4RlBnF+d0hLRuSjVB6UTiScIa0R0Wg8TthFVLhy1hGVmkCasrwLuwmPjpTFgZei6JFBxnCc1PmrDukt8gsBgd4YnDs+GJsJRsEDNhSeyRE5j9qVlc/tTYMuioVlzQW6KQI+JCYHJkaghiHw/PNHcKXan3uUvsSxagJYR4vcqQhUsRgISVA7phJUdh9KduZX1GDy4t8Sx6OsmO1HsLyBcBfMmOhF4yZSu8oDcJ2QoNelvMpJfoQEAGlEWHPrlMIXCwN8vCpcDh7SRnB3RAL2MrRh9h5OPewYe2tSXwMbV6SXlkqJzPTkYTNhWx5i0ncPLlJAniDpxukrFkwAk2K63U4JSiDK0Bm0RdP+sIThtHskFoaKJ87bD5x9WAoiC6D7dYYC9Dbq4ADHv9o911WoO98Dq6DmOv+Er3PWfopeYjcRfx0Gvc1tVz9gp5ca0+WSzQq/qMxRVanHBiESlkOUbl1XAiC1Aqdiyy5ObEzggsMlIZOwZYVtV+snNUuEKyR8rOrsOVzpUJO30LKxbUR17tWlR5ZHcr/B/foQpC6w/2GAUqga0j9o2gol+7Y19uIWXO51PK30T7/1HYHb0v7NZVxC+uKnQp+zxlB37VLwGK95dGt0q1ullsmUU5bxWVCvRc4b14DvRA4724CfMk5b3EnIlCP8LZGkZNItSzo63C1OQJ+NDKl2ZTR0HI07Kt5BDfNQXlP6ZL8rSPLqa0jaJf4w+VIC8a/aFfPQAAAABJRU5ErkJggg==');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
      .txt {
        text-align: center;
        .title {
          margin-top: 24px;
          font-size: 16px;
          line-height: 28px;
          color: #06003B;
          font-weight: bold;
        }
      }
    }
  }
}

// 背景毛玻璃效果
.g-page-bgfilter {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(3px);
    z-index: 10;
  }
}
*/