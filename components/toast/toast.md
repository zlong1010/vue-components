## Toast
`Toast` 组件使用方法

### 引用
```js
/** main.js */
import Toast from '@/toast';
Vue.use(Toast);
```

### 使用方法
```js
/** 需要注意的是Toast为单例，重复调用会重置Toast状态 */
this.$toast('操作成功'); // 默认为success样式
this.$toast({
  type: 'error', // success | error
  text: '操作失败',
  timeout: 1500,
});

/** 默认会有1.5s的超时时间，如果不需要超时，需手动维护一下toast状态 */
const toast = this.$toast({
  timeout: null,
});
setTimeout(() => {
  toast.close(); // 关闭toast
}, 3000);
```

### 参数

| Name      |    Tpye  | Default  | Describe |
| :-------- | :--------| :------- | :--- |
| type     | String |  success | toast类型，可选success,warning,error |
| text      |   String |  -  | 提示文字 |
| icon      |   String |  -  | 自定义icon的class |
| timeout | Number | 15000 | 超时时间 |

### 方法
| Name     | Describe |
| :-------- | :--------| 
| close     | 关闭toast |
