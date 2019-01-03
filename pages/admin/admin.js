// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members:{},
  },
  
  //审核通过
  onAllow: function(e){
    console.log("同意", e.target.dataset.id)
    //同意
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    let member = Membership.getWithoutData(query)
    member.set({
      state: 1,
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
      console.err(err)
      wx.showToast({
        title: err,
        icon: 'fail',
        duration: 2000
      })
    })

  },

  // 改名确认
  onEdit: function (e) {
    console.log("改名", e.target.dataset.id)
    //同意
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    let member = Membership.getWithoutData(query)
    member.set({
      state: 1,
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
      console.err(err)
      wx.showToast({
        title: err,
        icon: 'fail',
        duration: 2000
      })
    })
  },
  
  //踢出
  onDelete: function (e) {
    console.log("踢出",e.target.dataset.id)
    //同意
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    
    Membership.delete(query).then(res => {
      // success
      console.log(res)
      wx.showToast({
        title: '已踢出',
        icon: 'success',
        duration: 2000
      })
    }, err => {
      // err
      console.err(err)
      wx.showToast({
        title: err,
        icon: 'fail',
        duration: 2000
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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