var app = getApp()

Page({
  data: {
    id: null,
    idx: null, // order/index.js 中订单在 ordres 重的 index, 发货操作完成后，借助此 index 删除对应的元素
    deliverWayIndex: 0, // 默认示“快递派送”
    lineIndex: 0, // 默认表示顺丰
    deliverWayList: {
      items: [
        {
          action: { name: 'tap', bind: 'chooseDeliverWay' },
          content: { body: '运输方式', footer: '快递运输'},
        },
      ],
    },
    lineList: {
      items: [
        {
          action: { name: 'tap', bind: 'chooseLine' },
          content: { body: '快递', footer: '顺丰' },
        },
      ],
    },
    inputTrackingNumber: {
      name: 'trackingNumber', type: 'number', placeholder: '单号',
      footer: 'Scan', handler: 'scan',
      focus: true,
    },
    inputWeight: {
      name: 'weight', type: 'digit', placeholder: '重量',
    },
    btnLoading: false,
    btnDisabled: false,
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    this.setData({ 
      id: query.id,
      idx: query.idx,
      })
  },
  onShow: function () {
    // 加载会话
    app.loadSession()
    var page = this
  },
  chooseLine: function() {
    var page = this
    var lines = ['顺丰', '圆通', '德邦']
    wx.showActionSheet({
      itemList: lines,
      success: function(res) {
        page.setData({
          lineIndex: res.tapIndex,
          "lineList.items[0].content.footer": lines[res.tapIndex],
        })
      },
      fail: function(res) {
      }
    })
  },
  chooseDeliverWay: function() {
    var page = this
    var deliverWays = ['快递运输', '送货上门', '客户自提']
    wx.showActionSheet({
      itemList: deliverWays,
      success: function(res) {
        page.setData({
          deliverWayIndex: res.tapIndex,
          "deliverWayList.items[0].content.footer": deliverWays[res.tapIndex],
        })
      },
      fail: function(res) {
      }
    })
  },
  // 扫码获取快递单号
  scan: function (e) {
    var page = this
    wx.scanCode({
      success: (res) => {
        page.setData({
          "inputTrackingNumber.value": res.result,
        });
      }
    })
  },
  submit: function(event) {
    var page = this
    var data = event.detail.value

    data.orderId = page.data.id
    data.deliverWayIndex = page.data.deliverWayIndex
    data.lineIndex = page.data.lineIndex

    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.request({
      url: app.config.baseUrl + 'dispatches?key=' + app.data.session.key,
      method: 'POST',
      data: data,
      success: function (resp) {
        if (resp.statusCode == 200) {
          wx.showToast({
            title: '已发货'
          })
          var formerPage = app.getFormerPage()
          var formerOrders = formerPage.data.orders
          formerOrders.splice(page.data.idx, 1)
          // splice 调用后数组元素的序列值发生改变，需要重置
          formerOrders.forEach(function (order, i, orders) {
            orders[i].actions[1].dataset.idx = i
          })
          formerPage.setData({
            orders: formerOrders
          })
          wx.navigateBack()
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
