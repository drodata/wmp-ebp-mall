var app = getApp()

Page({
  data: {
    userInfo: null,
    province_id: null,
    city_id: null,
    district_id: null,
    province: { handler: 'checkProvince', },
    city: { handler: 'checkCity', },
    district: { handler: 'checkDistrict', },

    btnLoading: false,
    btnDisabled: false,
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    // 加载会话
    app.loadSession(function(session){
    })
    var page = this
    var items = []
    var provinces = app.region.provinces
    for (var key in provinces) {
      items.push({
        name: provinces[key],
        value: key,
      })
    }
    page.setData({"province.items": items})
  },
  // 自定义事件处理函数，响应点击按钮
  checkProvince: function(e) {
    var page = this
    var activeValue = e.detail.value
    page.setData({province_id: activeValue})
    var items = []
    var cities = app.region.cities[activeValue]
    for (var key in cities) {
      items.push({
        name: cities[key],
        value: key,
      })
    }
    page.setData({"city.items": items})
  },
  checkCity: function(e) {
    var page = this
    var activeValue = e.detail.value
    var items = []
    var districts = app.region.districts[activeValue]
    for (var key in districts) {
      items.push({
        name: districts[key],
        value: key,
      })
    }
    page.setData({
      city_id: activeValue,
      "district.items": items,
    })
  },
  checkDistrict: function(e) {
    var page = this
    page.setData({
      district_id: e.detail.value,
    })
    var pages = getCurrentPages()
    var formerPage = pages[pages.length - 2]
    var footer = app.region.provinces[page.data.province_id]
      + app.region.cities[page.data.province_id][page.data.city_id]
      + app.region.districts[page.data.city_id][page.data.district_id]

    formerPage.setData({
      "cells.region.content.footer": footer,
      "attributes.province_id": page.data.province_id,
      "attributes.city_id": page.data.city_id,
      "attributes.district_id": page.data.district_id,
    })
    wx.navigateBack()
  },
})
