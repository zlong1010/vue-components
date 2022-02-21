import Vue from 'vue';
import toastVue from './toast.vue';

const ToastComponent = Vue.extend(toastVue);

const defaults = {
  type: 'success',
  text: '',
  timeout: 1500,
};

let instance;

const Toast = (options = {}) => {
  const typeList = ['string', 'number'];
  if (typeList.includes(typeof options)) {
    options = { text: options };
  }
  options = { ...defaults, ...options };

  const parent = document.body;
  if (!instance) {
    instance = new ToastComponent({
      data: options,
    }).$mount();
    parent.appendChild(instance.$el);
  }
  Object.keys(options).forEach(key => {
    instance[key] = options[key];
  });

  Vue.nextTick(() => instance.show());
  return instance;
};

export default Toast;
