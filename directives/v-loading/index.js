/**
 * 局部loading指令
 * 包含背景模糊和loading动画
 * value: {
 *   show: bool, 是否显示
 *   title: string
 *   isBlur: bool 是否模糊
 *   page: boolean, 是否是页面loading, 为true 时dom被插入到body中, 否则插入父元素中
 * }
 */

 import Vue from 'vue';
 import loading from './loading.vue';
 
 // 默认参数
 const defaultParam = {
   title: '加载中...',
   isBlur: false,
   page: true,
 };
 
 export default {
   inserted(el, binding) {
     doLoading(el, binding.value);
   },
   update(el, binding) {
     console.debug('update binding: ', binding.value);
     doLoading(el, binding.value);
   },
   unbind(el) {
     removeLoadingDom(el);
   },
 };
 
 function doLoading(el, args = {}) {
   const params = { ...defaultParam, ...args };
   // 容器
   el._container = params.page ? document.body : el;
   el._container.style.outline = '1px solid red';
   params.show ? insertHtmlAfterParent(el, params) : removeLoadingDom(el);
 }
 
 function insertHtmlAfterParent(el, params) {
   if (el._instance) {
     // re-render
     el._instance.updateUi(params);
     return;
   }
   // render
   const Loading = Vue.extend(loading);
   const instance = new Loading({
     name: 'LoadinWrap',
     el: document.createElement('div'),
     render(h) {
       return h(
         loading,
         {
           props: params,
         },
       );
     },
   });
   const styleObj = {};
   styleObj.position = params.page ? 'fixed' : 'absolute';
   instance.$el.style = cssObjToStr(styleObj);
   el._instance = instance;
   el._container.appendChild(instance.$el);
 }
 
 function removeLoadingDom(el) {
   if (el._instance) {
     el._instance.$destroy();
     el._instance.$el.remove();
   }
   el._container = null;
 }
 
 function cssObjToStr(styleObj = {}) {
   return Object.keys(styleObj).reduce((acc, cur) => acc + `${cur}:${styleObj[cur]};`, '');
 }
 