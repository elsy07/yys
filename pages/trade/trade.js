// pages/trade/trade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataIsLoaded: !1,
trades:[],
    fragments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在查询交易',
    })
    let that = this
    let Fragments = new wx.BaaS.TableObject('fragments')
    let uid = wx.BaaS.storage.get("uid")
    let queryF = new wx.BaaS.Query()
    queryF.compare('created_by', '=', uid)
    queryF.compare('state', '=', '1')

    //查询碎片记录
    Fragments.setQuery(queryF).expand(['member', 'user']).find().then(res => {
      that.data.fragments = res.data.objects
      for (var i in that.data.fragments){
        let Trades = new wx.BaaS.TableObject('trade')
        let fragID = that.data.fragments[i].id
        
        let Fragment = Fragments.getWithoutData(fragID)
        console.log(Fragment)
        let queryT = new wx.BaaS.Query()
        queryT.compare('fragment', '=', Fragment)
        Trades.setQuery(queryT).expand(['fragment','buyer']).find().then(res=>{
          console.log(res)
          if(res.data.meta.total_count){
            that.data.trades.concat(res.data.objects)
          }

        }, err => {
          console.log(err)
          wx.showToast({
            title: '相关交易查询失败',
          })
        })
      }
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