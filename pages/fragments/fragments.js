// pages/fragments/fragments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    session_key: '',
    access_token: '',
    shikigamiID: '',
    data: []
  },
  applyPy: function() {
    wx.showToast({
      title: '待开发',
      icon: 'none'
    })
  },
  //通过menbeship表中的user在_userprofile表中查询对应用户的openid
  // getOpenId: function(id){


  // },
  getData: function(id) {
    let that = this
    let Fragment = new wx.BaaS.TableObject('fragments')
    let query = new wx.BaaS.Query()
    query.compare('shikigami', '=', id)

    //查询碎片记录
    Fragment.setQuery(query).expand(['member', 'user']).find().then(res => {
      let tmp = []
      for (var i in res.data.objects) {
        if (res.data.objects[i].num > 0) {
          tmp.push(res.data.objects[i])
        }
      }
      that.setData({
        dataIsLoaded: 1,
        data: tmp
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


  //可交易的才能触发
  onClickPY: function(e) {
    //更新碎片状态为正在交易
    let Fragment = new wx.BaaS.TableObject('fragments')
    let fragID = e.target.id

    let fragment = Fragment.getWithoutData(fragID)
    fragment.set({
      state: '1'
    })
    fragment.update().then((res) => {
        wx.showToast({
          title: '请尽快联系卖家',
          icon: 'success',
          duration: 5000
        })
      }
    )

    //记录买家和交易信息
    let Membership = new wx.BaaS.TableObject('membership')
    let memberID = wx.BaaS.storage.get("Membership").id
    let member = Membership.getWithoutData(memberID)
    let Trade = new wx.BaaS.TableObject('trade')
    let trade = Trade.create()
    trade.set({
      buyer: member,
      fragment: fragment,
      num: e.target.dataset.fragnum,
      shikigamiName: e.target.dataset.fragname,
      buyerWX: wx.BaaS.storage.get("userinfo").nickName
    })
    trade.save()
    //发送信息
    console.log("e", e);
    var that = this;
    let formId = e.target.dataset.formid
    if (formId) {
      let yys_name = wx.BaaS.storage.get("Membership").yys_name
      var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=' + that.data.access_token;
      var d = {
        "touser": e.target.dataset.seller, //卖家的openid   
        "weapp_template_msg": {
          "template_id": 'OY7l0IZnsmk2_JRfBylmnny4-bZxPxwpk7P08ZW7FNc',
          "page": '/pages/index/index',
          "form_id": formId,
          "data": { 
            "keyword1": {
              "value": yys_name,
              "color": "#4a4a4a"
            },
            "keyword2": {
              "value": wx.BaaS.storage.get("userinfo").nickName,
              "color": "#9b9b9b",
            },
            "keyword3": {
              "value": e.target.dataset.fragname,
              "color": "#9b9b9b"
            },
            "keyword4": {
              "value": e.target.dataset.fragnum,
              "color": "#9b9b9b"
            },
            "keyword5": {
              "value": yys_name + "想和你交换" + e.target.dataset.fragnum + "片" + e.target.dataset.fragname,
              "color": "#9b9b9b"
            },
          },
          color: '#ccc',
        }
      }
      wx.request({
        url: l,
        data: JSON.stringify(d),
        method: 'POST',
        success: function(res) {
          console.log(res);
          //弹窗显示已经发送信息
          wx.showToast({
            title: '已给对方发送消息',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: '交易消息发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      wx.showToast({
        title: '没有formid',
        icon: 'none',
        duration: 5000
      })
    }



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

    //第一步获取openid
    var that = this

    wx.login({
      success: function(data) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: "wx2f70c05c45ef1cc5",
            secret: "75de2aef6d5c2bd9cb6a5a01c325ad96",
            js_code: data.code //wx.login获取到的code
          },
          method: "post",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
            console.log(res);
            that.setData({
              openid: res.data.openid,
              session_key: res.data.session_key,
            })
          }
        })
      }
    })
    //第二步  获取access_token
    wx.request({
      // let appid = 'wx2f70c05c45ef1cc5',
      // let secret = '75de2aef6d5c2bd9cb6a5a01c325ad96'
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2f70c05c45ef1cc5&secret=75de2aef6d5c2bd9cb6a5a01c325ad96',
      method: "GET",
      success: function(res) {
        that.setData({
          access_token: res.data.access_token, //获取到的access_token
        })
      }
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