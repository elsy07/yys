// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members: {},
  },

  //审核通过 & 改名通过
  onAllow: function(e) {
    console.log("同意", e.target.dataset.id)
    //状态置为 1=良民
    let Membership = new wx.BaaS.TableObject(61452)
    let member = Membership.getWithoutData(e.target.dataset.id)
    member.set({
      state: 1,
      is_approve: true
    })
    member.update().then(res => {
      // success
      wx.showToast({
        title: '已通过',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
      console.log(err)
      wx.showToast({
        title: '失败',
        icon: 'fail',
        duration: 2000
      })
    })
    this.getMembers()
  },

  //设为管理员
  onAdmin: function (e) {
    console.log("设为管理员", e.target.dataset.id)
    //isAdmin标志位设置为true
    let Membership = new wx.BaaS.TableObject(61452)
    let member = Membership.getWithoutData(e.target.dataset.id)
    member.set({
      is_admin: true
    })
    member.update().then(res => {
      // success
      wx.showToast({
        title: '已设置',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
      console.log(err)
      wx.showToast({
        title: '失败',
        icon: 'fail',
        duration: 2000
      })
    })
    this.getMembers()
  },

  //审核驳回 & 踢出
  onDelete: function(e) {
    console.log("踢出", e.target.dataset.id)
    //不同意
    let Membership = new wx.BaaS.TableObject(61452)
    Membership.delete(e.target.dataset.id).then(res => {
      // success
      console.log(res)
      wx.showToast({
        title: '已踢出',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
      console.log(err)
      wx.showToast({
        title: '失败',
        icon: 'fail',
        duration: 2000
      })
    })
    this.getMembers()
  },

  getMembers: function() {
    var that = this
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()

    let query = new wx.BaaS.Query()
    Membership.setQuery(query).expand('user').find().then(res => {
      // success
      console.log("members", res.data)
      that.setData({
        members: res.data.objects
      })
    }, err => {
      // err
      console.err(errMsg)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getMembers()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})