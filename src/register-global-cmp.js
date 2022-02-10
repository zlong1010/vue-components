// 批量全局注册组件
// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue';

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './components',
  // Do not look in subdirectories
  false,
  // Only include "_base-" prefixed .vue files
  /\w+\.(vue|js)$/,
);

// For each matching file name...
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
