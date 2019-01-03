//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dataIsLoaded: 1,
    show30Tips: 1,
    hasShow30Tips: !1,
    time: 5,
    isApply: !1,
    userInfo: {},
    isApprove: !1,
    isAdmin: !1,
  },

  showDevelop: function() {
    wx.showToast({
      title: "功能正在开发中，敬请期待！",
      icon: "none",
      duration: 1500
    });
  },

onClickMe: function(){
  wx.navigateTo({
    url: '/pages/mine/mine?isAdmin=' + this.data.isAdmin,
  })
},

  onLoad: function() {
    var that = this
    if (wx.BaaS.storage.get('userinfo')) {
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      });
    }

    //查询是否注册过寮
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    Membership.setQuery(query).find().then(res => {
      // success
      console.log("isApply", res.data)

      //注册过
      if (res.data.meta.total_count) { 
        that.setData({
          isApply: true
        })
        //注册未通过
        if (res.data.objects[0].is_approve) {
          //注册已通过
          that.setData({
            isApprove: true,
            isAdmin: res.data.objects[0].is_admin,
            Membership: res.data.objects[0]
          })
        } 
      }
    }, err => {
      // err
      console.err(errMsg)
    })

  },

})