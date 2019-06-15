var app = getApp()

Page({
  data: {
    message: null, // 用于存储客户创建后的提示页面
    index: 0, // picker default value
    deliverWay: 0, 
    lineIndex: 0, // 默认表示顺丰
    lookup: null, //
    isMainland: true, // 是否是大陆地址，用来判断是否隐藏省市区行
    attributes: { 
      country_id: 47, // default to China
      show_price: false,
    }, // 搜集所需的其它属性值
    fields: {
      full_name: {
        name: 'full_name', placeholder: '全称',
      },
      short_name: {
        name: 'short_name', placeholder: '简称(8个字以内)',
      },
      contacter: {
        name: 'contacter', placeholder: '联系人',
      },
      duty: {
        name: 'duty', placeholder: '职务（选填）',
      },
      cell_phone: {
        name: 'cell_phone', type: 'number', placeholder: '手机',
      },
      office_phone: {
        name: 'office_phone', placeholder: '固定电话',
      },
      street: {
        name: 'street', placeholder: '街道名称(国内地址不要重复输入省市区信息)', style: 'height: 3.5em',
      }
    },
    cells: {
      customerIndustry: {
        label: '所属行业',
        items: null, // lookup/list 加载后填充
        handler: 'pickIndustry',
      },
      customerVia: {
        label: '获取渠道',
        items: null, // lookup/list 加载后填充
        handler: 'pickVia',
      },
      currency: {
        action: { name: 'tap', bind: 'chooseCurrency' },
        content: { body: '交易币种' },
      },
      invoiceType: {
        action: { name: 'tap', bind: 'chooseInvoiceType' },
        content: { body: '开票属性', footer: '' },
      },
      countryId: {
        action: { name: 'navigate', url: '/pages/common/country-chooser' },
        content: { body: '国家', footer: '中国'},
      },
      region: {
        action: { name: 'tap', bind: 'chooseRegion' },
        content: { body: '省市区', footer: ''},
      },
      showPrice: {
        label: '发货清单上显示销售单价',
        handler: 'switchShowPrice',
      },
    },
    btnLoading: false,
    btnDisabled: false,
  },
  onLoad: function (query) {
    var page = this
  },
  onShow: function () {
    // 加载会话
    var page = this
    app.loadSession(function (session) {
      wx.request({
        url: app.config.baseUrl + 'lookup/list?key=' + session.key
          + '&type=OrderCurrency,CustomerInvoiceType&category=customerVia,customerIndustry',
        success: function (resp) {
          if (resp.statusCode == 200) {
            var lookup = resp.data
            page.setData({
              lookup: lookup,
              "cells.customerIndustry.items": lookup.customerIndustry.nameList,
              "cells.customerVia.items": lookup.customerVia.nameList,
            })
          } else {
            app.handleError(resp)
          }
        },
      })
    })
  },
  switchShowPrice: function(e) {
    this.setData({
      "attributes.show_price": e.detail.value,
    })
  },
  pickIndustry: function(e) {
    this.setData({
      "cells.customerIndustry.value": e.detail.value,
      "attributes.industry_id": this.data.lookup.customerIndustry.valueList[e.detail.value],
    })
  },
  pickVia: function(e) {
    this.setData({
      "cells.customerVia.value": e.detail.value,
      "attributes.via_id": this.data.lookup.customerVia.valueList[e.detail.value],
    })
  },
  chooseCurrency: function() {
    var page = this
    var items = page.data.lookup.OrderCurrency.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        page.setData({
          "attributes.currency": page.data.lookup.OrderCurrency.valueList[res.tapIndex],
          "cells.currency.content.footer": items[res.tapIndex],
        })
      },
    })
  },
  chooseInvoiceType: function() {
    var page = this
    var items = page.data.lookup.CustomerInvoiceType.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        page.setData({
          "attributes.invoice_type": page.data.lookup.CustomerInvoiceType.valueList[res.tapIndex],
          "cells.invoiceType.content.footer": items[res.tapIndex],
        })
      },
    })
  },
  chooseRegion: function() {
    var page = this
    wx.navigateTo({url: '/pages/common/region'})
  },
  submit: function(event) {
    var page = this
    var data = event.detail.value
    data = Object.assign(data, page.data.attributes)
    this.setData({
      btnLoading: true,
      btnDisabled: true,
    })
    wx.request({
      url: app.config.baseUrl + 'customers?key=' + app.data.session.key,
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
