var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    uploader: {
      title: '图片上传',
      files: [],
      previewHandlerName: 'previewImage',
      chooseHandlerName: 'chooseImage',
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
    })
  },
  chooseImage: function (e) {
    var page = this;

    if (page.data.uploader.files.length > 0) {
      wx.showToast({title: '至多可上传一张图片'})
      return
    }

    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        page.setData({
          "uploader.files": page.data.uploader.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e){
    wx.previewImage({
      //current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.uploader.files // 需要预览的图片http链接列表
    })
  },
  uploadFiles: function () {
    var page = this
    page.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.uploadFile({
      url: app.config.baseUrl + 'media/upload',
      filePath: page.data.uploader.files[0],
      name: 'file',
      formData: { // 这里存放额外的数据
        name: 'hello'
      },
      success: function(res){
        console.log(res)
        return false
        var data = JSON.parse(res.data)
        wx.showModal({
          title: '图片上传成功',
          content: '在服务器上文件名为: ' + data.serverPath,
        })
      },
      complete: function(){
        page.setData({
          btnLoading: false,
          btnDisabled: false,
        })
      }
    })
  },
})
