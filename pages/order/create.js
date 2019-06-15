var app = getApp()

Page({
  data: {
    message: null, // 存放表单创建后的消息对象，用于显示表单提交后的提示信息
    needAudit: false, // 开关
    btnLoading: false,
    btnDisabled: false,
    customer: null, // 存储所选客户的对象
    isForeignCurrency: false, // 标记是否使用外币结算, 方便控制汇率栏的显示
    isOutsouring: false, // 标记是否外购订单, 方便控制订货明细中成本价的显示
    fields: {
      exchange_rate: { name: 'exchange_rate', label: '汇率', type: 'digit', placeholder: '输入100外币兑换人民币数'},
      note: { name: 'note', placeholder: '订单备注', style: 'height: 8em' },
    },
    attributes: {
      customer_id: null,
      currency: null,
      payment_way: null,
      via: null,
      source: null,
      outsourcing_id: null,
      attachments: [],

      address_id: null,
      apply_to_customs: false,
      note: '',
    },
    cells: {
      customer: {
        action: { name: 'navigate', url: '../customer/search?scenario=order'},
        content: { body: '客户'},
      },
      address: {
        action: { name: 'navigate', url: '../common/outsourcing'}, // 这是个假值, 选择客户后会动态重设该值
        content: { body: '收货地址'},
      },
      supplier: {
        action: { name: 'navigate', url: '../common/outsourcing'},
        content: { body: '供应商'},
      },
      currency: {
        content: { body: '交易币种' },
      },
      payment_way: {
        action: { name: 'tap', bind: 'choosePaymentWay' },
        content: { body: '结算方式' },
      },
      via: {
        action: { name: 'tap', bind: 'chooseVia' },
        content: { body: '订货渠道' },
      },
      source: {
        action: { name: 'tap', bind: 'chooseSource' },
        content: { body: '货物来源' },
      },
      applyToCustomsSwitch: {label: '需要报关', checked: false, handler: 'switchApplyToCustoms'},
      attachment: {
        handler: 'checkAttachment',
        items: [
          {name: '发货清单', value: 'goods_list', checked: true},
          {name: '粒度分析报告', value: 'particle_chart'},
          {name: '扫描电镜', value: 'sem'},
        ],
      },
    },
    goods: [],
  },
  checkAttachment: function (e) {
    var page = this
      , result = app.syncCheckboxList(page.data.cells.attachment.items, e.detail.value)
    page.setData({
      "attributes.attachments": e.detail.value,
      "cells.attachment.items": result,
    })
  },

  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    // 加载会话
    var page = this
    app.loadSession(function (session) {
      wx.request({
        url: app.config.baseUrl + 'lookup/list?key=' + session.key
          + '&type=OrderCurrency,OrderVia,ProductSource,OrderDeliverWay,OrderPaymentWay,ProductName,ProductLevel,GoodsType,Purity,Solute',
        success: function (resp) {
          if (resp.statusCode == 200) {
            var lookup = resp.data
            page.setData({
              lookup: lookup,
            })
            // 初始化 goods 对象，生成第一行货物明细
            if (page.data.goods.length == 0) {
              page.insertRow(0)
            }
          } else {
            app.handleError(resp)
          }
        },
      })
    })
  },
  // switch
  switchApplyToCustoms: function (e) {
    var page = this
      , value = e.detail.value
    page.setData({
      "attributes.apply_to_customs": value,
    })
  },
  // actionSheet
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
  chooseVia: function() {
    var page = this
    var items = page.data.lookup.OrderVia.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        page.setData({
          "attributes.via": page.data.lookup.OrderVia.valueList[res.tapIndex],
          "cells.via.content.footer": items[res.tapIndex],
        })
      },
    })
  },
  chooseSource: function() {
    var page = this
    var items = page.data.lookup.ProductSource.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        page.setData({
          "attributes.source": page.data.lookup.ProductSource.valueList[res.tapIndex],
          "cells.source.content.footer": items[res.tapIndex],
          isOutsourcing: res.tapIndex == 1, // 1表示外购
        })
      },
    })
  },
  choosePaymentWay: function() {
    wx.showModal({
      title: '提示',
      content: '订单的结算方式由客户的结算方式决定，无法更改。',
    })
  },
  appendRow: function () {
    var page = this
    page.insertRow( page.data.goods.length )
  },
  insertRow: function (idx) {
    var page = this
    var template = {
      isSample: false,
      isYmg: false,
      needLevel: true, // 标记当前货物是否需要设置品级，只有研磨膏和微粉需要设置品级
      fields: {
        uprice: { name: "goods[" + idx + "]uprice", label: '单价', type: 'digit', bindinput: 'inputing', dataset: {index: idx, name: 'uprice'}},
        cost: { name: "goods[" + idx + "]cost", label: '成本价', type: 'digit', bindinput: 'inputing', dataset: {index: idx, name: 'cost'}},
        quantity: { name: 'goods[' + idx + ']quantity', label: '数量', type: 'digit', bindinput: 'inputing', dataset: {index: idx, name: 'quantity'}},
        size: { name: 'goods[' + idx + ']size', label: '粒度', bindinput: 'inputing', dataset: {index: idx, name: 'size'}},
      },
      attributes: {
        type: null,
        name: null,
        level: null,
        size: null,
        solute: null,
        purity: null,
        uprice: null,
        cost: null,
        quantity: null,
      },
      cells: {
        name: {label: '品名', items: page.data.lookup.ProductName.nameList, handler: 'pickProduct', dataset: {index: idx} },
        purity: { label: '浓度', items: page.data.lookup.Purity.nameList, handler: 'pickPurity', dataset: {index: idx} },
        type: { action: { name: 'tap', bind: 'chooseGoodsType', dataset: {index: idx}}, content: { body: '类别' } },
        level: { action: { name: 'tap', bind: 'chooseLevel', dataset: {index: idx}}, content: { body: '品级' } },
        solute: { action: { name: 'tap', bind: 'chooseSolute', dataset: {index: idx}}, content: { body: '溶解性' } },
      },
    }
    var list = page.data.goods
    list.push(template)
    page.setData({goods: list})
  },
  // 文本框输入内容变动事件，为了解决动态删除一行后，表单元素不能保持的问题
  inputing: function (e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , name = e.currentTarget.dataset.set.name
      , formerGoods = page.data.goods
    formerGoods[index].fields[name].value = e.detail.value
    formerGoods[index].attributes[name] = e.detail.value
    page.setData({goods: formerGoods})
  },
  deleteRow: function (e) {
    var page = this
      , index = e.currentTarget.dataset.set
    if (page.data.goods.length == 1) {
      console.log('can not delete')
      return
    }
    var formerGoods = page.data.goods
    if (index == 0) {
      formerGoods.shift()
    } else {
      formerGoods.splice(index, 1)
    }
    // splice 调用后数组元素的序列值发生改变，需要重置
    formerGoods.forEach(function (item, i, goods) {
      goods[i].cells.type.action.dataset.index = i
      goods[i].cells.level.action.dataset.index = i
      goods[i].cells.solute.action.dataset.index = i
      goods[i].cells.purity.dataset.index = i
      goods[i].cells.name.dataset.index = i

      goods[i].fields.uprice.name = "goods[" + i + "]uprice"
      goods[i].fields.cost.name = "goods[" + i + "]cost"
      goods[i].fields.quantity.name = "goods[" + i + "]quantity"
      goods[i].fields.size.name = "goods[" + i + "]size"
    })
    page.setData({goods: formerGoods})
  },
  // goods action sheets
  chooseGoodsType: function(e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , items = page.data.lookup.GoodsType.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        var goods = page.data.goods
        goods[index].attributes.type = page.data.lookup.GoodsType.valueList[res.tapIndex]
        goods[index].cells.type.content.footer = items[res.tapIndex]
        goods[index].isSample = res.tapIndex == 1 // 1 表示样品

        if (res.tapIndex == 1) {
          // 样品无需输入单价, 将单价、成本价值设置为 null
          goods[index].attributes.uprice = null
          goods[index].attributes.cost = null
        }
        page.setData({goods: goods})
      },
    })
  },
  // 选择品级
  chooseLevel: function(e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , items = page.data.lookup.ProductLevel.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        var goods = page.data.goods
        goods[index].attributes.level = page.data.lookup.ProductLevel.valueList[res.tapIndex]
        goods[index].cells.level.content.footer = items[res.tapIndex]
        page.setData({goods: goods})
      },
    })
  },
  // 选择品名
  pickProduct: function(e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , value = e.detail.value
      , goods = page.data.goods

      goods[index].attributes.name = page.data.lookup.ProductName.valueList[value]
      goods[index].cells.name.value = value
      goods[index].isYmg = value == 1 // 1 表示研磨膏
      goods[index].needLevel = value < 2 // 只有 0 和 1 需要设置品级

      // 若选择了无需设置品级的产品，确保其值为 null
      if (value > 1) {
        goods[index].attributes.level = null
        goods[index].cells.level.content.footer = ''
      }

      page.setData({goods: goods})
  },
  // 选择研磨膏浓度
  pickPurity: function(e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , value = e.detail.value
      , goods = page.data.goods

      goods[index].attributes.purity = page.data.lookup.Purity.valueList[value]
      goods[index].cells.purity.value = value

      page.setData({goods: goods})
  },
  // 选择研磨膏溶解性
  chooseSolute: function(e) {
    var page = this
      , index = e.currentTarget.dataset.set.index
      , items = page.data.lookup.Solute.nameList
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        var goods = page.data.goods
        goods[index].attributes.solute = page.data.lookup.Solute.valueList[res.tapIndex]
        goods[index].cells.solute.content.footer = items[res.tapIndex]
        page.setData({goods: goods})
      },
    })
  },
  submitForm: function(event) {
    var page = this
      , data = event.detail.value
    data = Object.assign(data, page.data.attributes)
    var splices = []
    page.data.goods.forEach(function (item, i, goods) {
        splices.push(item.attributes)
    })
    data.goods = splices
    // 所有数据都放在服务端验证

    //console.log(data)
    wx.request({
      url: app.config.baseUrl + 'orders?key=' + app.data.session.key,
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
