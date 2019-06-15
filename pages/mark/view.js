var app = getApp()

Page({
  data: {
    id: null, // model id
    modelPanel: null,
  },
  onLoad: function (query) {
    this.setData({ id: query.id })
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
      wx.request({
        url: app.config.baseUrl + 'marks/' + page.data.id + '?key=' + app.data.session.key,
        success: function (resp) {
          if (resp.statusCode != 200) {
            app.handleError(resp)
          }
          var model = resp.data
          // panel items
          var cells = [
            {
              type: 'appmsg', 
              action: {name: 'tap', bind: 'previewImage', dataset: {
                urls: [model.images.o],
              }},
              content: {
                thumbnail: model.images.t,
                title: model.time + '签到',
                desc: model.note,
                access: true,
              },
            },
            {
              type: 'smallAppmsg', 
              action: {name: 'tap', bind: 'openLocation', dataset: {
                longitude: model.longitude,
                latitude: model.latitude,
              }},
              content: {
                thumbnail: '/icons/location.png',
                body: model.location,
                access: true,
              },
            },
            {
              type: 'smallAppmsg', 
              content: {
                thumbnail: '/icons/user.png',
                body: model.creator,
              },
            },
          ]
          if (model.customer_id != null) {
            cells.push({
              type: 'smallAppmsg', 
              content: {
                body: '关联客户',
                footer: model.customerName,
              },
            })
          }
          page.setData({modelPanel: {
            header: model.time,
            items: cells,
          }})
        }
      })
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
