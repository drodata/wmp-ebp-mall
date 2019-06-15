var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: false,
    panel2: {
      header: '标准图文样式',
      items: [
        {
          type: 'appmsg',
          content: {
            thumbnail: '/icons/user.png',
            title: '标题一',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
        {
          type: 'text',
          content: {title: '标题一', desc: 'jk' },
        },
      ],
    },
    panel: {
      header: '标准图文样式',
      items: [
        {
          type: 'appmsg',
          content: {
            thumbnail: '/icons/user.png',
            title: '标题一',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
        {
          type: 'appmsg',
          content: {
            thumbnail: '/icons/user.png',
            title: '标题一',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
      ],
      footer: {
        text: 'More',
        url: '/demo/index',
      },
    },
    panelSmall: {
      header: '小图文组合',
      onlyList: true,
      items: [
        {
          type: 'smallAppmsg',
          action: {name: 'tap', bind: 'go'},
          content: { thumbnail: '/icons/user.png', body: '标题一', access: true },
        },
        {
          type: 'smallAppmsg',
          content: { thumbnail: '/icons/user.png', body: '标题一', footer: 'jk' },
        },
      ],
    },
    panelText: {
      header: '文本样式（无跳转）',
      items: [
        {
          type: 'text',
          content: {
            title: '标题一',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
        {
          type: 'text',
          content: {
            title: '标题 2',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
      ],
    },
    panelHybrid: {
      header: '混搭样式',
      items: [
        {
          type: 'appmsg',
          content: {
            thumbnail: '/icons/user.png',
            title: '标题一',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
            badge: 'dot',
          },
        },
        {
          type: 'text',
          content: {
            title: '标题一支持小红点',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          },
        },
        {
          type: 'smallAppmsg',
          content: { thumbnail: '/icons/user.png', body: '标题一', footer: 'jk' },
        },
      ],
    },
  },
  onLoad: function (option) {
    // option.query 含有 query 对象
  },
  onShow: function () {
    var page = this
    app.loadSession(function (session) {
    })
  },
  // 自定义事件处理函数，响应点击按钮
  go: function() {
    wx.showModal({
      content: 'Hello world',
    })
  },
})
