var app = getApp()

Page({
  data: {
    message: null, // 存放表单创建后的 visit 对象，该值设置后，将转向显示页面
    btnLoading: false,
    btnDisabled: false,
    validateCarbon: false,

    attributes: {
      customer_id: null,
      longitude: null,
      latitude: null,
      carbon: null,
    },
    fields: {
      note: {
        name: 'note',
        placeholder: '备注',
        style: 'height: 8em'
      },
    },
    cells: {
      location: {
        action: { name: 'tap', bind: 'openLocation'},
        content: { body: '我的位置'},
      },
      customer: {
        action: { name: 'navigate', url: '../customer/search?scenario=mark'},
        content: { body: '关联客户'},
      },
      carbon: {
        action: { name: 'navigate', url: '../common/carbon?scenario=mark'},
        content: { body: '抄送范围'},
      },
    },
    uploader: {
      title: '图片上传',
      files: [],
      previewHandlerName: 'previewImage',
      chooseHandlerName: 'chooseImage',
    },
  },
  onLoad: function (query) {
    this.setData({ customer_id: query.customer_id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session){})
    // 获取坐标
    wx.getLocation({
      type: 'gcj02',
      success: function(resp) {
        page.setData({
          "attributes.longitude": resp.longitude,
          "attributes.latitude": resp.latitude,
        })
      }
    })
  },

  openLocation: function() {
    wx.openLocation({
      longitude: this.data.attributes.longitude,
      latitude: this.data.attributes.latitude,
      scale: 28
    })
  },

  chooseImage: function (e) {
    var page = this;
    if (page.data.uploader.files.length > 0) {
      wx.showToast({title: '仅需上传一张图片'})
      return
    }
    if (!page.data.validateCarbon) {
      wx.showToast({title: '请选择发送范围'})
      return
    }
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['camera'],
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
      urls: this.data.uploader.files // 需要预览的图片http链接列表
    })
  },
  submitForm: function(event) {
    var page = this
    var data = event.detail.value
    data = Object.assign(data, page.data.attributes)
    if (page.data.uploader.files.length == 0) {
      wx.showToast({title: '你没有上传图片'})
      return false
    }
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })

    wx.uploadFile({
      url: app.config.baseUrl + 'media/upload?key=' + app.data.session.key,
      filePath: page.data.uploader.files[0],
      name: 'file',
      formData: {
        type: 1, // 图片
        category: 4, // 客户拜访
      },
      success: function(res){
        // media 属性
        var rsp = JSON.parse(res.data)
        // 获得服务器上已存储的图片 id
        data.media_id = rsp.id

        // 至此，mark POST 所需所有数据已准备完毕
        wx.request({
          url: app.config.baseUrl + 'marks?key=' + app.data.session.key,
          method: 'POST',
          data: data,
          success: function (resp) {
            if (resp.statusCode == 200) {
              // resp.data 含有 message 对象
              page.setData({ message: resp.data })
            } else {
              app.handleError(resp)
            }
          },
          complete: function (res) {
            page.setData({
              btnLoading: false,
              btnDisabled: false,
            })
          }
        })
      },
    })
  },
})
