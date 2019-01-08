// pages/changeName/changeName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  changeNameSubmit(e) {
    console.log('form发生了changeNamesubmit事件，携带数据为：', e.detail.value.yys_newName)
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
        yys_name: e.detail.value.yys_newName
      })
      member.update().then(res => {
        // success
        wx.showToast({
          title: '提交成功',
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
      wx.navigateTo({
        //点击提交后跳转index页面
        url: "/pages/index/index"
      })
    }, err => {
      // err
      console.err(errMsg)
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