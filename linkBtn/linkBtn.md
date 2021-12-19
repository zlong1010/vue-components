# linkBtn

> 跳转功能的按钮，可以在当前页面跳转也可以新开标签页跳转，支持和 `$router.push` 相同的参数

## props

| Name      |    Tpye  | Default  | Describe |
| :-------- | :--------| :------- | :--- |
| to     | String 或 Object | - | 跳转路由，和 `$router.push` 相同的参数 |
| _blank | Boolean | false | 是否强制用新标签页打开 |

当_blank为false，点击按钮在当前页面跳转，按住ctrl 或 command 点击按钮在新标签页打开

当_blank为true，点击按钮在新标签页打开

### Slot

| Name     | Describe |
| :-------- | :--------|
| Default | 子元素 |