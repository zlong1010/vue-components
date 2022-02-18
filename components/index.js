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