/**
 * 批量全局注册组件和指令
 * https://webpack.js.org/guides/dependency-management/#require-context
 */
import Vue from 'vue';

const requireComponent = require.context(
  './components',
  // Do not look in subdirectories
  false,
  /\w+\.(vue|js)$/,
);

const successCmp = [];
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  const cmp = componentConfig.default || componentConfig;
  if (!cmp.name) {
    console.error(`${fileName} no component name!`);
    return;
  }
  successCmp.push(cmp.name);
  Vue.component(cmp.name, cmp);
});
console.log('\n全局注册:\n', successCmp.join('\n'));

// 注册指令
const requireDirect = require.context(
  '../directives',
  true,
  /index\.js$/,
);
requireDirect.keys().forEach(fileName => {
  const config = requireDirect(fileName);
  const direcName = /v-(\w+)\//.exec(fileName)[1];
  console.log(`\n指令名: ${direcName}`);
  Vue.directive(direcName, config.default || config);
});
