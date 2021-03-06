//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dataIsLoaded: !1,
    show30Tips: 1,
    hasShow30Tips: !1,
    time: 5,
    isApply: !1,
    userInfo: {},
    isApprove: !1,
    isAdmin: !1,
    groups: {
      'test': '1546581681122823',
      'release': '1546614719450807'
    },
    contents: {
      'activity': 1546698081029793,
      'mission': 1546698728539707,
      'benefits': 1546698915352215,
      'test': 1546582016390327,
      'solutionD': 1546702280880943,
      'solutionS': 1546702335900878,
      'solutionY': 1547477107695432,
      'test': 1546582147982185
    }
  },
  show30: function(e) {
    console.log(e)
    var that = this
    let mem_id = wx.BaaS.storage.get("Membership").id
    let form_id = e.detail.formId
    console.log("更新formid：",form_id)
    let Membership = new wx.BaaS.TableObject(61452)
    let member = Membership.getWithoutData(mem_id)
    member.set("formid", form_id)
    member.update().then(res => { 
      that.setData({
        show30Tips: !1
      })
    }, err => {
      // err
    })

  },

  showDevelop: function() {
    wx.showToast({
      title: "功能正在开发中，敬请期待！",
      icon: "none",
      duration: 1500
    });
  },

  onLoad: function() {
    var that = this
    if (wx.BaaS.storage.get('userinfo')) {
      this.setData({
        userInfo: wx.BaaS.storage.get('userinfo')
      });
    }
    wx.showLoading({
      title: '马上就好',
    })
    //查询是否注册过寮
    let Membership = new wx.BaaS.TableObject(61452)
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    Membership.setQuery(query).find().then(res => {
      //注册过
      if (res.data.meta.total_count) {
        that.setData({
          isApply: true
        })
        //注册未通过
        if (res.data.objects[0].is_approve) {
          //注册已通过
          wx.BaaS.storage.set('Membership', res.data.objects[0])
          that.setData({
            isApprove: true,
            isAdmin: res.data.objects[0].is_admin,
            //Membership: res.data.objects[0]
          })
        }
      }
      that.setData({
        dataIsLoaded: 1
      })
      wx.hideLoading()
    }, err => {
      console.log(err)
      wx.showToast({
        title: '注册信息查询失败',

      })
    })

  },

})