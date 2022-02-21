import toast from './src/index';

toast.install = function(Vue) {
  Vue.prototype.$toast = toast;
};

export default toast;
