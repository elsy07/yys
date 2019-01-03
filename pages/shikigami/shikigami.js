var app = getApp();

Page({
  data: {
    activeIndex: 0,
    shishenData: {},
    shishenType: [],
    shikigami: [],
    dataIsLoaded: !1
  },
  
  onLoad: function (a) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    })
    let shikigami = new wx.BaaS.TableObject(61369)
    let query = new wx.BaaS.Query()
    shikigami.setQuery(query).limit(50).find().then(res => {
      // success
      wx.hideLoading()
      console.log(res.data.objects) 
      that.setData({
        dataIsLoaded: 1 ,
        shikigami: res.data.objects
      })  
    }, err => {
      // err
      console.error(err)
    })



  },

});