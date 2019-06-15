var app = getApp()

Page({
  data: {
    userInfo: null,
    btnLoading: false,
    btnDisabled: true,
    scenario: null, // 从什么页面跳到该页面, 例如 'mark' 表示在新建外勤签到页面
    validateCarbon: false, // 是否正确选择了范围
    isAll: false,
    departmentIds: [],
    userIds: [],
    names: [[], [], []], // 根据所选内容生成对应的名称数组,位置与 carbon 数组顺序一致
    desc: '', // 根据 names 数据组装出 desc 字符串
    carbon: {
      all: {
        handler: 'checkAll',
        items: [{
          name: '全公司',
          value: 1,
        }],
      },
      department: {
        handler: 'checkDepartment',
        items: [],
      },
      user: {
        handler: 'checkUser',
        items: [],
      },
    },
  },
  onLoad: function (query) {
    // query 表示 url query string 对应的对象
    this.setData({ scenario: query.scenario })
  },
  onShow: function () {
    // 加载会话
    app.loadSession(function(session){
    })
    var page = this
    wx.request({
      url: app.config.baseUrl + 'departments?key=' + app.data.session.key,
      success: function (resp) {
        var departments = resp.data.departments
          , users = resp.data.users
          , departmentItems = []
          , userItems = []

        departments.forEach(function (department, idx) {
          departmentItems.push({
            name: department.name,
            value: department.id
          })
        })
        users.forEach(function (user, idx) {
          userItems.push({
            name: user.display_name,
            value: user.id
          })
        })
        page.setData({
          'carbon.department.items': departmentItems,
          'carbon.user.items': userItems,
        })
      }
    })
  },
  // 根据复选框的选择情况启用或禁用确认按钮
  toggleButtonVisibility: function () {
    var page = this
      , names = page.data.names
      , slices = [] 

    var desc = slices.concat(names[0], names[1], names[2]).join(', ')
      , invalid = !page.data.isAll && (page.data.departmentIds.length == 0) && (page.data.userIds.length == 0)

    page.setData({
      desc: desc,
      validateCarbon: !invalid,
      btnDisabled: invalid,
    })
  },
  checkAll: function (e) {
    var page = this
      , result = app.syncCheckboxList(page.data.carbon.all.items, e.detail.value, true)
    this.setData({
      isAll: e.detail.value.length > 0,
      'carbon.all.items': result[0],
      'names[0]': result[1],
    })
    page.toggleButtonVisibility()
  },
  checkDepartment: function (e) {
    var page = this
      , result = app.syncCheckboxList(page.data.carbon.department.items, e.detail.value, true)
    this.setData({
      departmentIds: e.detail.value,
      'carbon.department.items': result[0],
      'names[1]': result[1],
    })
    page.toggleButtonVisibility()
  },
  checkUser: function (e) {
    var page = this
      , result = app.syncCheckboxList(page.data.carbon.user.items, e.detail.value, true)
    this.setData({
      userIds: e.detail.value,
      'carbon.user.items': result[0],
      'names[2]': result[1],
    })
    page.toggleButtonVisibility()
  },
  // 确认所选内容
  confirmCheck: function () {
    var page = this
    app.getFormerPage().setData({
      validateCarbon: page.data.validateCarbon,
      'cells.carbon.content.footer': page.data.desc,
      'attributes.carbon': [
        page.data.isAll,
        page.data.departmentIds,
        page.data.userIds
      ]
    })
    wx.navigateBack()
  }
})
