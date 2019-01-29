// pages/trade/trade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataIsLoaded: !1,
    tmp: [],
    trades: [],
    fragments: []
  },

  getData: function() {
    let that = this
    let Fragments = new wx.BaaS.TableObject('fragments')
    let uid = wx.BaaS.storage.get("uid")
    let queryF = new wx.BaaS.Query()
    queryF.compare('created_by', '=', uid)
    //queryF.compare('state', '=', '1')

    //查询碎片记录
    Fragments.setQuery(queryF).expand(['member', 'user']).find().then(res => {
      that.data.fragments = res.data.objects
      that.data.tmp = []
      for (var i in that.data.fragments) {
        let Trades = new wx.BaaS.TableObject('trade')
        let fragID = that.data.fragments[i].id

        let Fragment = Fragments.getWithoutData(fragID)
        console.log(Fragment)
        let queryT = new wx.BaaS.Query()
        queryT.compare('fragment', '=', Fragment)
        Trades.setQuery(queryT).expand(['fragment', 'buyer']).orderBy('-created_at').find().then(res => {
          that.data.tmp.push.apply(that.data.tmp, res.data.objects)
          that.setData({
            dataIsLoaded: 1,
            trades: that.data.tmp
          })
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

  onClickConfirm: function(e) {
    console.log(e)
    var that = this
    //更新碎片状态为正常 数量置0
    let Fragments = new wx.BaaS.TableObject('fragments')
    let fragID = e.target.dataset.fragid
    let fragment = Fragments.getWithoutData(fragID)
    fragment.set({
      state: '0',
      num: 0
    })
    fragment.update().then(res => {
      let Trades = new wx.BaaS.TableObject('trade')
      let tradeID = e.target.id
      let trade = Trades.getWithoutData(tradeID)
      console.log(trade)
      //更新交易状态 1=已成功
      trade.set({
        state: 1
      })
      trade.update().then(res => {
        let mem_id = wx.BaaS.storage.get("Membership").id
        let form_id = e.detail.formId
        console.log("更新formid：", form_id)
        let Membership = new wx.BaaS.TableObject(61452)
        let member = Membership.getWithoutData(mem_id)
        member.set("formid", form_id)
        member.update().then(res => {
          wx.showToast({
            title: '碎片已换出',
            icon: 'success'
          })
          that.getData()
        }, err => {
          // err
        })
      }, err => {
        console.log(err)
        wx.showToast({
          title: '更新交易状态失败',
          icon: 'none'
        })
      })
    }, err => {
      console.log(err)
      wx.showToast({
        title: '更新碎片状态失败',
        icon: 'none'
      })
    })
  },

  onClickCancel: function(e) {
    console.log(e)
    var that = this
    //更新碎片状态为正常
    let Fragments = new wx.BaaS.TableObject('fragments')
    let fragID = e.target.dataset.fragid
    let fragment = Fragments.getWithoutData(fragID)
    fragment.set({
      state: '0'
    })
    fragment.update().then(res => {
      let Trades = new wx.BaaS.TableObject('trade')
      let tradeID = e.target.id
      let trade = Trades.getWithoutData(tradeID)
      console.log(trade)
      //更新交易状态 2=已失败
      trade.set({
        state: 2
      })
      trade.update().then(res => {
        let mem_id = wx.BaaS.storage.get("Membership").id
        let form_id = e.detail.formId
        console.log("更新formid：", form_id)
        let Membership = new wx.BaaS.TableObject(61452)
        let member = Membership.getWithoutData(mem_id)
        member.set("formid", form_id)
        member.update().then(res => {
          wx.showToast({
            title: '碎片恢复可交易状态',
            icon: 'success'
          })
        }, err => {
          // err
        })

        that.getData()
      }, err => {
        console.log(err)
        wx.showToast({
          title: '更新交易状态失败',
          icon: 'none'
        })
      })
    }, err => {
      console.log(err)
      wx.showToast({
        title: '更新碎片状态失败',
        icon: 'none'
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在查询交易',
    })
    this.getData()
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