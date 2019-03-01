// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    member: {},
    yys_newName: '',
    showModal: false
  },

  getMembership: function() {
    let Membership = new wx.BaaS.TableObject(61452)
    let recordID = wx.BaaS.storage.get("Membership").id
    let member = Membership.get(recordID).then(res => {
      this.setData({
      membership: res.data
    })
    }, err => {
      console.err(err)
      wx.showToast({
        title: '用户查询失败',
        icon: 'none',
        duration: 2000
      })
    })
    
  },

  showDevelop: function() {
    wx.showToast({
      title: "功能正在开发中！",
      icon: "none",
      duration: 1500
    });
  },

  changeName: function(e) {
    console.log(e)
    this.setData({
      showModal: true
    })
  },

  onChangeName: function(e) {
    this.data.yys_newName = e.detail.value
  },

  modalCancel: function(e) {
    console.log(e)
    this.setData({
      showModal: false
    })
  },

  modalConfirm: function(e) {
    var that = this
    //获取membership表
    let Membership = new wx.BaaS.TableObject(61452)
    //获取uid
    let uid = wx.BaaS.storage.get("uid")
    //通过uid查询membership表中的id
    let query = new wx.BaaS.Query()
    var User = new wx.BaaS.User()
    query.compare('user', '=', User.getWithoutData(uid))
    //通过id查询数据库中对应数据
    Membership.setQuery(query).find().then(res => {
      // success
      //state=2是改名状态
      //获取对应数据并修改state和更新新昵称
      let member = Membership.getWithoutData(res.data.objects[0].id)
      member.set({
        state: 2,
        yys_name: this.data.yys_newName
      })
      member.update().then(res => {
        // success
        this.setData({
          showModal: false
        })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        that.getMembership()
      }, err => {
        console.log(err)
        this.setData({
          showModal: false
        })
        wx.showToast({
          title: '改名失败',
          icon: 'none',
          duration: 2000
        })
      })
    }, err => {
      console.err(errMsg)
      wx.showToast({
        title: '用户查询失败',
        icon: 'none',
        duration: 2000
      })
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.BaaS.storage.get('userinfo')) {
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      });
    }
    this.getMembership()
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