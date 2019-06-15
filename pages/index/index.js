//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: null,
    session:null,
    isFeedReady: false, // 加载首页 feed 状态
    glanceList: { items: [ ] },
    quickList: { items: [ ] },
    // 注意此处属性名称在下面 request() 中使用，修改属性名称时要小心
    indexPanel: {
      items: [
        {
          type: 'appmsg', 
          action: {name: 'navigate', url: '/pages/notification/index'},
          content: {
            thumbnail: '/icons/notification.png',
            title: '通知',
            // 以下两个属性远程设置
            desc: '',
            badge: null,
          },
        },
        {
          type: 'appmsg', 
          action: {name: 'navigate', url: '/pages/timeline/index'},
          content: {
            thumbnail: '/icons/work.png',
            title: '工作',
            // 以下两个属性远程设置
            desc: '',
            badge: null,
          },
        },
      ],
    },
  },
  onLoad: function () {
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
      page.setData({session: session})

      if (!session.isBind) {
        wx.redirectTo({ url: '../index/bind' })
        return false
      }
      // 根据角色组装个性化列表(glance 和 shorthand 两个 list)
      var glance = [], quick = []
      if (app.util.inArray('saler', session.user.roles)) {
        glance.push(page.listMap.customer.index)
        glance.push(page.listMap.order.create)
      } else if (app.util.inArray('productionDirector', session.user.roles)) {
        glance.push(page.listMap.dispatch.index)
      }
      quick.push(
        page.listMap.mark.create,
        page.listMap.audit.create,
        page.listMap.demo
      )

      page.setData({
        "glanceList.items": glance,
        "quickList.items": quick,
      })

      // 拉取用户个性化信息
      page.setData({isFeedReady: false})
      page.fetchFeed(function (feed) {
        page.setFeed(feed)
      })
    })
  },
  fetchFeed: function (cb) {
    wx.request({
      url: app.config.baseUrl + 'users/feed?key=' + app.data.session.key,
      success: function (resp) {
        if (resp.statusCode != 200) {
          app.handleError(resp)
        }
        var feed = resp.data
        typeof cb == "function" && cb(feed)
      },
    })
  },
  setFeed: function (feed) {
    var page = this
    page.setData({
      isFeedReady: true,
      "indexPanel.items[0].content.desc": feed.notification.desc,
      "indexPanel.items[0].content.badge": feed.notification.unreadNumber > 0 ? feed.notification.unreadNumber : null,
      "indexPanel.items[1].content.desc": feed.timeline.desc,
      "indexPanel.items[1].content.badge": feed.timeline.unreadNumber > 0 ? 'dot' : null,
    })
  },
  onPullDownRefresh: function() {
    var page = this
    page.fetchFeed(function (feed) {
      page.setFeed(feed)
    })
  },
  listMap: {
    demo: {
      content: { body: 'Demo', badge: null},
      action: { name: 'navigate', url: '/pages/demo/index'},
    },
    customer: {
      index: {
        content: { body: '客户'},
        action: { name: 'navigate', url: '/pages/customer/index'},
      },
    },
    order: {
      create: {
        content: { body: '新建订单'},
        action: { name: 'navigate', url: '/pages/order/create'},
      },
    },
    dispatch: {
      index: {
        content: { body: '发货'},
        action: { name: 'navigate', url: '/pages/order/index'},
      },
    },
    audit: {
      create: {
        content: { body: '新建普通审批'},
        action: { name: 'navigate', url: '/pages/audit/create'},
      },
    },
    mark: {
      create: {
        content: { body: '新建外勤签到'},
        action: { name: 'navigate', url: '/pages/mark/create'},
      },
    },
  },
})
