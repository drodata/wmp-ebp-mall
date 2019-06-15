# 快速开始

## 使用模板文件创建一个页面

微信开发工具内的新建 Page 功能不好用，默认的模板文件不能自定义；页面配置文件和页面样式文件不常用，完全可以省略掉。在 `pages/` 目录下新建两个模板文件 `tpl.js` 和 `tpl.wxml`. 如需新建一个页面时，使用下面的命令快速创建：

```bash
cd pages
mkdir customer
cp tpl.js customer/index.js
cp tpl.wxml customer/index.wxml
```
