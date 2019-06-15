//app.js
var ui = require('./utils/ui.js')
var util = require('./utils/util.js')
var region = require('./utils/region.js')
var config = require('./config')

App({
  ui: ui,
  util: util,
  config: config,
  region: region,
  onLaunch: function () {
  },
  onShow: function () {
    // 将会话和用户存储到 app.data 属性内, 供页面调用
    var app = this
  },
  getFormerPage: function () {
    var pages = getCurrentPages()
    return pages[pages.length - 2]
  },
  // 通用的 checkbox list 样式同步函数
  syncCheckboxList: function (items, values, showName = false) {
    var names = []
    items.forEach(function (item, i) {
      items[i].checked = false
      values.forEach(function (value, j) {
        if (items[i].value == values[j]){
          items[i].checked = true
          names.push(items[i].name)
        }
      })
    })
    return showName ? [items, names] : items
  },
  /**
   * 获取 code
   * cb signature: function (code)
   */
  getCode: function (cb) {
    wx.login({
      success: function (res) {
        console.log(res)
        typeof cb == "function" && cb(res.code)
      },
      fail: function(res) {
      }
    })
  },
  /**
   * 远程获取，会将获得数据存储 app.data 对象内
   * cb signature: function (userInfo)
   */
  getUserInfo: function (cb) {
    var app = this
    app.getCode(function (code) {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          var userInfo = res.userInfo
          wx.setStorageSync('userInfo', userInfo)
          app.data.userInfo = userInfo
          typeof cb == "function" && cb(userInfo)
        },
        fail: function (res) {
          console.log('failed to get user info')
        },
      })
    })
  },
  /**
   * 显性登录
   * cb signature: function (session)
   */
  login: function (cb) {
    var app = this
    app.getCode(function (code) {
      app.getUserInfo(function (userInfo) {
        ui.showLoading('登录中……')
        wx.request({
          url: config.loginUrl,
          method: 'POST',
          data: {
            code: code,
          },
          success: function (res) {
            var objSession = res.data
            wx.setStorageSync('session', objSession)
            app.data.session = objSession
            typeof cb == "function" && cb(objSession)
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) { ui.hideLoading() }
        })
      })
    })
  },
  loadSession: function (cb) {
    var app = this
    var session = wx.getStorageSync('session')
    var userInfo = wx.getStorageSync('userInfo')

    if (!session) {
      app.login(function (session) {
        app.data.session = session
        app.data.userInfo = userInfo
        typeof cb == "function" && cb(session)
      })
    } else {
      wx.checkSession({
        success: function () {
          app.data.session = session
          app.data.userInfo = userInfo
          typeof cb == "function" && cb(session)
        },
        fail: function () {
          app.login(function (session) {
            app.data.session = session
            app.data.userInfo = userInfo
            typeof cb == "function" && cb(session)
          })
        },
      })
    }
  },
  /* wx.request() 返回状态码为非 200 时的处理函数 */
  handleError: function (resp) {
    var app = this
    var data = resp.data
    var statusCode = resp.statusCode
    wx.showModal({
      title: data.name,
      content: data.message,
      success: function (res) {
        if (res.confirm && statusCode == 401) {
          wx.removeStorageSync('session')
          wx.redirectTo({
            url: '../index/bind',
          })
        }
      }
    })
  },
  /**
   * 通用的预览图片函数
   * @param array urls 要预览的图片地址
   */
  previewImage: function(urls){
    wx.previewImage({ urls: urls })
  },
  /**
   * 通用的查看位置函数
   * @param object geo 坐标对象，包含经纬度两个属性
   */
  openLocation: function(geo) {
    wx.openLocation({
      longitude: geo.longitude,
      latitude: geo.latitude,
      scale: 28
    })
  },
  data: {
    userInfo: null,
    session: null
  }
})
