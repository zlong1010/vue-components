# v-copy 指令

**说明**

> 指令没有提供参数，只提供指令值，指令值可选并有 `string` 和 `object` 两种类型，`object` 类型包含 `str` 和 `taget` 两个可选字段

**用法**

> - 默认情况下目标元素时绑定指令的元素，如果需要指定目标元素用 `v-copy="{target: css选择器}"`
>
> - 复制的字符串默认为目标元素的 `textContent`，如果需要指定字符串可以使用：
>   - `v-copy:"name"` 
>   - `v-copy="{str: name, target: '.sub-cls'}"` 
>
> - 指令已经在目标元素上添加`cursor: pointer; text-decoration: 'underline'`



## example
  - `<p v-copy>xxxxx</p>`
  - `<FormItem title="MAC地址" :desc="data.Mac" v-copy="data.Mac" />`
  - `<FormItem title="MAC地址" :desc="data.Mac" v-copy="{target: '.sub-cls'}" />`
  - `<FormItem title="MAC地址" :desc="data.Mac" v-copy="{str: '.sub-cls', target: '.sub-cls'}" />`