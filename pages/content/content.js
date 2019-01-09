

Page({

  /**
   * 页面的初始数据
   */
  data: {
    richText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '大姐正在输入',
    })
    var that = this
    let id = options.id
    let groupid = options.groupid

    let ContentGroupTest = new wx.BaaS.ContentGroup(groupid)
    ContentGroupTest.getContent(id).then(res => {
      console.log(res.data)
      if (res.data) {
        let html = res.data.content
        that.setData({
          richText: html
        })
        wx.hideLoading()
      }

    }, err => {
      console.log(err)
      wx.showToast({
        title: '内容获取失败',
        icon: 'none'
      })
    })
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