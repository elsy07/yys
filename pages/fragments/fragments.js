// pages/fragments/fragments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shikigamiID: '',
    data: []
  },
  applyPy: function() {
    wx.showToast({
      title: '待开发',
      icon: 'none'
    })
  },
  getData: function(id) {
    let that = this
    let Fragment = new wx.BaaS.TableObject('fragments')
    let query = new wx.BaaS.Query()
    query.compare('shikigami', '=', id)

    //查询碎片记录
    Fragment.setQuery(query).expand(['member', 'user']).find().then(res => {

      that.setData({
        dataIsLoaded: 1,
        data: res.data.objects
      })

      wx.hideLoading()
    }, err => {
      console.log(err)
      wx.showToast({
        title: '碎片查询失败',
      })
      wx.hideLoading()
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shikigamiID = options.id
    console.log(shikigamiID)
    wx.showLoading({
      title: '正在查找',
    })
    this.getData(shikigamiID)
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