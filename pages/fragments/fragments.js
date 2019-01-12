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

  sendMsg: function() {

  },

//可交易的才能触发
  onClickPY: function(e) {
    //更新碎片状态为正在交易
    let Fragment = new wx.BaaS.TableObject('fragments')
    let fragID = e.target.id
    let fragment = Fragment.getWithoutData(fragID)
    fragment.set({
      state: '1'
    })
    fragment.update()

    //记录买家和交易信息
    let Membership = new wx.BaaS.TableObject('membership')
    let memberID = wx.BaaS.storage.get("Membership").id
    let member = Membership.getWithoutData(memberID)

    let Trade = new wx.BaaS.TableObject('trade')
    let trade = Trade.create()
    trade.set({
      buyer: member,
      fragment: fragment
    })
    trade.save()

    //发送信息

    //弹窗显示已经发送信息

    //刷新页面
    this.getData(this.data.shikigamiID)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shikigamiID = options.id
    this.data.shikigamiID = shikigamiID
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