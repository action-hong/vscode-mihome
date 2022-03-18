# vscode-mihome README

这是一个用于开发米家拓展程序的插件

## 功能

### 自动识别当前项目中的所有插件项目，一键打包，

由于经常会一次性开发多款插件，每次打包时都不得不打命令`npm run publish com.yi.ge.bao.ming`，很麻烦。虽然可以配置别名将敲打的命令变短一些，但是每次新增一个项目就得配置个新别名，太麻烦了。于是就有了这么个功能，自动识别当前项目中的所有插件项目，提供一个按钮，点击即可完成命令的输入：

![](/1.gif)


## 配置

`mihome.projectAliasMap`

配置项目的别名，便于别人识别某某包对应什么项目

例如我们有个项目，包名为`com.xiaomi.demo`，在列表上是这么现实的:

![](/1.png)

然后我们可以在配置文件中做这么一个配置:

```json
# .vscode/setting.json
{
  ...
  "mihome.projectAliasMap": {
    "com.xiaomi.demo": "模板项目"
  }
}

```

就会刚刚配置对应的名称也加上，方便辨识

![](/2.png)