// 动态创建组件
/*
import Vue from 'vue';
import router from '@/router';
import CusDialog from './userDialog.vue';

export default function createDialog(title, fields) {
  const instance = new Vue({
    ...CusDialog,
    router,
    propsData: {
      visible: true,
      title,
      fieldOpts: fields,
    },
  }).$mount();

  // const instance = new Vue({
  //   router,
  //   render(h) {
  //     return h(CusDialog, {
  //       props: {
  //         visible: true,
  //         title,
  //         fieldOpts: fields,
  //       },
  //     });
  //   },
  // }).$mount();
  document.body.appendChild(instance.$el);
  return instance;
}
*/

/**
 * 用 Vue.extend 继承router、store等, 不用再传递 router
import cusDialog from './userDialog.vue';
const CusDialog = Vue.extend(cusDialog);
 
export default function createDialog(title, fields) {
  const instance = new CusDialog({
    propsData: {
     visible: true,
     title,
      fieldOpts: fields,
    },
  }).$mount();
  document.body.appendChild(instance.$el);
  return instance;
}
 */
