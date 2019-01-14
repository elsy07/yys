Page({
  data: {
    button: true
  },

  // 微信用户登录小程序
  userInfoHandler: function (data) {
    console.log(data)
    wx.BaaS.handleUserInfo(data).then(res => {
      console.log(res)
      wx.navigateTo({
        url: "/pages/index/index"
      });
    }, res => {
      console.log("拒绝授权")
    })
  },

  onLoad: function () {

    var that = this
    //查询是否有缓存
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()

    if (wx.BaaS.storage.get("uid")) {
      console.log("有用户信息")

      wx.navigateTo({
        url: '/pages/index/index',
      })
    }



  },
  onShareAppMessage: function () {
    return {
      title: "桜行诗",
      path: "/pages/index/index"
    };
  }
});