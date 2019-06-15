var app = getApp()

Page({
  data: {
    btnLoading: false,
    btnDisabled: false,
    inputShowed: true,
    inputVal: '',
    resultItems: [],
    countryRadioList: { handler: 'check', },
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
  showInput: function () {
    this.setData({inputShowed: true });
  },
  hideInput: function () {
    this.setData({inputShowed: false, inptuVal: ''});
  },
  clearInput: function () {
    this.setData({inputVal: ''});
  },
  // 选择某个国家
  check: function(e) {
    var page = this
    var item = e.currentTarget.dataset.set
    app.getFormerPage().setData({
      "attributes.country_id": item.id,
      "cells.countryId.content.footer": item.slug,
      isMainland: item.id == '47',
      // 不管选择的是不是外国，选择后一律重置省市区
      "attributes.province_id": null,
      "attributes.city_id": null,
      "attributes.district_id": null,
      "cells.region.content.footer": '',
    })
    wx.navigateBack()
  },
  // 用户输入关键词，根据关键词实时获取信息
  inputTyping: function (e) {
    var page = this
    var keyword = e.detail.value
    //return false
    this.setData({ inputVal: keyword });

    wx.request({
      url: app.config.baseUrl + 'countries?keyword=' + keyword + '&key=' + app.data.session.key,
      success: function (response) {
        var slices = [];
        response.data.items.forEach(function (item, index) {
          slices.push({
            action: { name: 'tap', bind: 'check', dataset: {
              id: item.id, slug: item.slug
            } },
            content: { body: item.slug },
          })
        })
        page.setData({resultItems: slices})
      }
    })
  }
})
