/**
 * 与原生input使用方法一样，只是新增了 desc、errMsg 两个props
 */
import InputV2 from './src/inputv2.vue';

InputV2.install = function (Vue) {
  Vue.component(InputV2.name, InputV2);
};

export default InputV2;
