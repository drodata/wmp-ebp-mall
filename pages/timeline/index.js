var app = getApp()

Page({
  data: {
    panelListView: {
      items: null,
      pagination: {},
      hasMore: false,
      reachBottom: false,
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    //this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function(session){
      if (page.data.panelListView.items === null) {
        wx.request({
          // markRead 是一个开关，值为1表示拉取数据前将所有未读消息设为已读
          url: app.config.baseUrl + 'timelines?sort=-created_at&markRead=1&key=' + app.data.session.key,
          success: function (resp) {
            if (resp.statusCode != 200) {
              app.handleError(resp)
            }
            page.assemble(resp.data)
          },
        })
      }
    })
  },
  // 获取到从业务服务器返回的数据后组装成模板需要的格式，同时更新页面内相应的数据
  assemble: function (data) {
    var page = this
      , items = []

    // 没有满足条件的
      data.items.forEach(function (timeline) {
        var cells = []
        switch (timeline.message.category) {
          case 6: // 收入到账通知
            break
          case 7: // 外勤签到
            cells.push({
              type: 'appmsg', 
              action: {name: 'tap', bind: 'previewImage', dataset: {
                urls: [timeline.message.reference.images.o],
              }},
              content: {
                thumbnail: timeline.message.reference.images.t,
                title: timeline.time + '签到',
                desc: timeline.message.reference.note,
                access: true,
              },
            })
            cells.push({
              type: 'smallAppmsg', 
              action: {name: 'tap', bind: 'openLocation', dataset: {
                longitude: timeline.message.reference.longitude,
                latitude: timeline.message.reference.latitude,
              }},
              content: {
                thumbnail: '/icons/location.png',
                body: timeline.message.reference.location,
                access: true,
              },
            })
            break
          case 8: // 普通审批
            cells.push({
              type: 'text', 
              content: {
                title: '普通审批',
                desc: timeline.message.content,
              },
            })
            break
        }
        items.push({
          header: timeline.creator + ' ' + timeline.time,
          items: cells,
        })
      })
    page.setData({
      panelListView: {
        items: page.data.panelListView.items === null ? items : page.data.panelListView.items.concat(items),
        pagination: data.meta,
        hasMore: data.meta.currentPage < data.meta.pageCount,
        reachBottom: false,
      }
    })
  },
  previewImage: function(e){
    app.previewImage(e.currentTarget.dataset.set.urls)
  },
  openLocation: function(e){
    app.openLocation({
      longitude: e.currentTarget.dataset.set.longitude,
      latitude: e.currentTarget.dataset.set.latitude,
    })
  },
})
