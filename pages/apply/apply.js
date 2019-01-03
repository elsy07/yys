// pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //注册
    let Membership = new wx.BaaS.TableObject(61452)
    let uid = wx.BaaS.storage.get("uid")
    let user = new wx.BaaS.User().getWithoutData(uid)
    let member = Membership.create()
    member.set({
      user: user,
      state: 0,
      is_approve: false,
      yys_id: e.detail.value.yys_id,
      yys_name: e.detail.value.yys_name
    })
    member.save()
    wx.navigateTo({
      url: "/pages/index/index"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})