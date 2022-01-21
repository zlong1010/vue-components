# 局部loading指令

# example
```vue
<table v-loading={isLoading: true}></table>
```

# 指令参数
无

# 指令值
| 指令值    | 类型    | 默认值    | 描述            |
| --------- | ------- | --------- | --------------- |
| isLoading | boolean | -         | 是否显示        |
| title     | string  | 加载中... |                 |
| icon      | string  | -         |                 |
| isBlur    | boolean | true      | 是否模糊        |
| isModal   | boolean | false     | 是否是modal弹窗 |