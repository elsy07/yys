//app.js
App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment);

    wx.BaaS.init('4573abbe1e6dd13c97d7');
  },

  globalData: {
    userInfo: null
  }
})