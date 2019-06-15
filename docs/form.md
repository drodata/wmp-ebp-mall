# Form Submit

表单提交需要用到 `<form>`, `<button>`, `<input>` 等组件。一个最基本的表单看上去是这样：

```xml
<form bindsubmit="submitForm" bindreset="resetForm">
  <input name="title" focus="true" class="weui-input"/>
  <textarea name="note" class="weui-textarea" placeholder="请简要输入沟通内容" style="height: 9.3em" />
  <button type="primary" formType="submit" loading="{{btnLoading}}" disabled="{{btnDisabled}}">提交</button>
</form>
```

- 表单组件 `bindsubmit` 的值是一个事件处理函数名，该函数页面对应的 js 文件内，用于搜集数据，向业务服务器发送请求；
- 所有表单元素的 `name` 属性都必须设置，如果用户留空不填，搜集的值是 `''`;
- 按钮组件的 `formType` 指定按钮触发的是 submit 还是 reset 动作，与表单组件的 `bindsubmit` 属性呼应；

提交表单事件函数内容大致如下：

```js
Page({
  submitForm: function(event) {
    var page = this
    // 表单数据存储在 event.detail.value 内，值是一个对象，以上面的表单为例，
    // 值为 {title: 'hello', note: 'world'}
    var formData = event.detail.value


    // 在发送请求前，可以追加表单搜集不到的自定义数据
    formData.customer_id = page.data.customer_id
    
    wx.request({
      url: app.config.baseUrl + 'customers?access-token=xxx',
      method: 'POST',
      data: formData,
      success: function (res) {
        console.log(res.data)
      },
    })
  }
})
```
