# 虚拟列表组件

> 支持一行多列情况
> 
> 备注：在已有的组件上二次开发，原仓库 https://github.com/tangbc/vue-virtual-scroll-list

## props

| 属性  | 类型 | 必填  |默认值 | 说明  |
| ---- | ---- | ---- | ---- | ---- |
| dataKey | String/Function | 是 |-|数据项的唯一标识|
| dataSources | Array | 是 |-|数据列表|
| scrollArea | String/Object | 否 |组件自身|滚动区域|
| keeps | Number | 否 | 50 | 页面上渲染的元素的数量|
| estimateSize | Number|否|0|每项的高度|

## slots

- header
- footer