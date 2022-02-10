# 局部loading指令

# example
```vue
<table v-loading={show: true}></table>
```

# 指令参数
无

# 指令值
| 指令值    | 类型    | 默认值    | 描述            |
| --------- | ------- | --------- | --------------- |
| show | boolean | -         | 是否显示，必填项        |
| title     | string  | 加载中... |                 |
| isBlur    | boolean | true      | 是否模糊        |
| page   | boolean | true     | 是否是页面loading, 为true 时dom被插入到body中, 否则插入父元素中 |