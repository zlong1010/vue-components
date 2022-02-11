## Input
### 参数

- 原生 input标签 的属性不变，type maxlength 等其他属性用法不变；
- 原生 input标签 的监听事件只有 input事件 抛出的参数有变化，input 抛出两个参数: value 和 event，其他监听器不变


| Name      |    Tpye  | Default  | Describe |
| :-------- | :--------| :------- | :--- |
| search     | Boolean |  false | 是否有搜索Icon |
| hasCopy    |   Boolean |  false  | 是否可以复制输入框的值 |
| desc | String | '' | 字段描述 |
| errMsg | String | '' | 报错信息 |
| textarea | Boolean | false | 是否是textarea |
| cleanBlank | Boolean | true | 失焦时自动清除首尾空格 |

## 主要功能

- 根据传入的 errMsg 是否为空显示报错文案
- 复制输入框内容
- 自动计算 textarea 的字符数量
- type 为 number 只能输入数字，不能输入特殊字符
- 失焦自动清除首尾空格