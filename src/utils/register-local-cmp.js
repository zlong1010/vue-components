// 批量注册局部组件
// const requireComponent = require.context('', false, /\w+\.(vue|js)$/);
// const cmps = {};
// requireComponent.keys().map(fileName => {
//   const cmp = requireComponent(fileName).default || componentConfig;
//   if (!cmp.name) {
//     console.error(`${fileName} no component name!`);
//     return;
//   }
//   cmps[cmp.name] = cmp;
// });
// console.log('局部注册：', Object.keys(cmps).join('\n'));
