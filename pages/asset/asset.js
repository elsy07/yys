var app = getApp();

Page({
  data: {
    showModal: false,
    shikigamiID: '',
    num: 0,
    //canEx: true,
    canSell: false,
    canBuy: false,
    activeIndex: 'ssr',
    type: ['ssr', 'sp', '联动','sr','皮肤'],
    shikigami: {},
    shikigamiName: '',
    shikigamiByType: [],
    shikigamiAll: [],
    myAssets: [],
    want: '',
    wantName: '',
    wantIndex: 0
  },

  getData: function() {
    console.log('getData')

    wx.showLoading({
      title: "加载中..."
    })
    var that = this

    //查所有碎片记录
    let Fragment = new wx.BaaS.TableObject('fragments')
    let uid = wx.BaaS.storage.get("uid")
    let queryF = new wx.BaaS.Query()
    queryF.compare('created_by', '=', uid)
    Fragment.setQuery(queryF).select(['shikigami', 'num', 'canSell']).limit(1000).find().then(res => {
      console.log(res)
      this.data.myAssets = res.data.objects

      //查找所有式神
      let shikigami = new wx.BaaS.TableObject(61369)
      shikigami.limit(50).find().then(res => {
        that.setData({
          shikigamiAll: res.data.objects
        })

        var ssr = []
        var sp = []
        var ld = []
        var sr = []
        var skin = []

        for (var i in that.data.shikigamiAll) {
          for (var j in that.data.myAssets) {
            if (that.data.shikigamiAll[i].num == that.data.myAssets[j].shikigami) {
              that.data.shikigamiAll[i].fragNum = that.data.myAssets[j].num
              that.data.shikigamiAll[i].canSell = that.data.myAssets[j].canSell
            }
          }
          if (that.data.shikigamiAll[i].type == 'ssr') {
            ssr.push(that.data.shikigamiAll[i])
          }
          if (that.data.shikigamiAll[i].type == 'sp') {
            sp.push(that.data.shikigamiAll[i])
          }
          if (that.data.shikigamiAll[i].type == '联动') {
            ld.push(that.data.shikigamiAll[i])
          }
          if (that.data.shikigamiAll[i].type == 'sr') {
            sr.push(that.data.shikigamiAll[i])
          }
          if (that.data.shikigamiAll[i].type == '皮肤') {
            skin.push(that.data.shikigamiAll[i])
          }
        }

        that.setData({
          shikigami: {
            'ssr': ssr,
            'sp': sp,
            '联动': ld,
            'sr': sr,
            '皮肤': skin
          }
        })

        if (that.data.activeIndex == 'ssr') {
          that.setData({
            shikigamiByType: that.data.shikigami.ssr
          })
        }
        if (that.data.activeIndex == 'sp') {
          that.setData({
            shikigamiByType: that.data.shikigami.sp
          })
        }
        if (that.data.activeIndex == 'sr') {
          that.setData({
            shikigamiByType: that.data.shikigami['sr']
          })
        }
        if (that.data.activeIndex == '联动') {
          that.setData({
            shikigamiByType: that.data.shikigami['联动']
          })
        }

        //查want记录
        let Membership = new wx.BaaS.TableObject('membership')
        var User = new wx.BaaS.User()
        let queryU = new wx.BaaS.Query()
        queryU.compare('user', '=', User.getWithoutData(uid))
        Membership.setQuery(queryU).find().then(res => {
          console.log(res)
          if (res.data.meta.total_count) {
            for (var k in that.data.shikigamiAll) {
              if (that.data.shikigamiAll[k].num == res.data.objects[0].want) {
                that.data.want = res.data.objects[0].want
                that.data.wantName = res.data.objects[0].wantName
                that.setData({
                  //want: res.data.objects[0].want,
                  wantIndex: k,
                  canBuy: res.data.objects[0].canBuy
                })
              }
            }
          }
          wx.hideLoading()
        }), err => {
          console.log(err)
          wx.showToast({
            title: '个人愿望查询失败',
            icon: 'none'
          })
          wx.hideLoading()
        }

      }, err => {
        console.error(err)
        wx.showToast({
          title: '所有式神查询失败',
          icon: 'none'
        })
        wx.hideLoading()
      })
    }), err => {
      console.log(err)
      wx.showToast({
        title: '碎片记录查询失败',
        icon: 'none'
      })
    }
  },

  //式神稀有度tab切换 
  changeActive: function(e) {
    console.log(e)
    var type = e.target.id

    this.setData({
      activeIndex: type,
      shikigamiByType: this.data.shikigami[type]
    });
  },

  formSubmit: function(e) {
    console.log(e)
    var that = this
    let Membership = new wx.BaaS.TableObject('membership')
    var User = new wx.BaaS.User()
    let uid = wx.BaaS.storage.get("uid")
    let query = new wx.BaaS.Query()
    query.compare('user', '=', User.getWithoutData(uid))
    Membership.setQuery(query).find().then(res => {
      console.log(res)
      if (res.data.meta.total_count) {
        let recordID = res.data.objects[0].id
        let member = Membership.getWithoutData(recordID)
        member.set({
          canBuy: that.data.canBuy,
          want: that.data.want,
          wantName: that.data.wantName
        })
        member.update().then(res => {
          wx.showToast({
            title: '愿望更新成功',
            icon: 'success',
            duration: 2000
          })
        }, err => {
          console.log(err)
          wx.showToast({
            title: '愿望更新失败',
            icon: 'none',
            duration: 2000
          })
        })
      }
    }, err => {
      // err
      console.log(err)
      wx.showToast({
        title: '没有该用户',
        icon: 'none'
      })
    })
  },

  onChangeWant: function(e) {
    console.log(e)
    this.setData({
      want: this.data.shikigamiAll[e.detail.value].num,
      wantName: this.data.shikigamiAll[e.detail.value].name,
      wantIndex: e.detail.value
    })
  },
  onChangePY: function(e) {
    console.log(e)
    this.setData({
      canBuy: !this.data.canBuy
    })
  },

  //点击头像开始登记碎片 
  regAsset: function(e) {
    console.log(e)
    var shikigamiID = e.currentTarget.id

    this.setData({
      showModal: true,
      num: 0,
      shikigamiID: shikigamiID,
      shikigamiName: e.currentTarget.dataset.name,
      canSell: false
    })
  },

  //登记数量 
  onChangeNum: function(e) {
    console.log(e)
    this.setData({
      num: e.detail.value
    })
  },

  // //是否交换 
  // onChangeEx: function(e) {
  //   console.log(e)
  //   this.setData({
  //     canEx: e.detail.value
  //   })
  // },

  //是否买卖 
  onChangeSell: function(e) {
    console.log(e)
    this.setData({
      canSell: e.detail.value
    })
  },

  //登记确认 
  modalConfirm: function(e) {
    console.log(e)
    var that = this
    //登记
    let Fragment = new wx.BaaS.TableObject('fragments')
    let Membership = new wx.BaaS.TableObject('membership')
    let memberID = wx.BaaS.storage.get("Membership").id
    let Member = Membership.getWithoutData(memberID)

    let uid = wx.BaaS.storage.get("uid")
    let User = new wx.BaaS.User()
    let user = User.getWithoutData(uid)

    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', uid)
    query.compare('shikigami', '=', this.data.shikigamiID)

    //查询是否有记录
    Fragment.setQuery(query).limit(1).find().then(res => {
      //如果没有登记过，新建记录
      if (res.data.meta.total_count == 0) {
        let asset = Fragment.create()
        asset.set({
          user: user,
          member: Member,
          shikigami: this.data.shikigamiID,
          num: this.data.num,
          shikigamiName: this.data.shikigamiName,
          canSell: this.data.canSell
        })
        asset.save().then(res => {

          this.setData({
            showModal: false,
          })
          wx.showToast({
            title: '登记碎片成功',
          })

        }, err => {
          console.log(err)
          wx.showToast({
            title: '新增碎片失败',
          })
        })
      } else if (res.data.meta.total_count != 0) {
        //如果已有记录就更新
        var recordID = res.data.objects[0].id
        let asset = Fragment.getWithoutData(recordID)
        asset.set({
          num: that.data.num,
          canSell: that.data.canSell
        })
        asset.update().then(res => {
          this.setData({
            showModal: false
          })
          wx.showToast({
            title: '更新碎片成功',
          })
        }, err => {
          // err
          console.log(err)
          wx.showToast({
            title: 'err',
          })
        })
      } 
      // else if (res.data.meta.total_count != 0 && that.data.num == 0) {
      //   //如果已有记录就删除
      //   var recordID = res.data.objects[0].id
      //   Fragment.delete(recordID).then(res => {
      //     this.setData({
      //       showModal: false
      //     })
      //     wx.showToast({
      //       title: '已删除碎片记录',
      //       icon: 'success',
      //       duration: 2000
      //     })
      //   }, err => {
      //     console.log(err)
      //     wx.showToast({
      //       title: '碎片记录删除失败',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   })
      // }


      this.getData()
    }, err => {
      // err
      console.log(err)
      wx.showToast({
        title: 'err',
      })
    })

  },

  //登记取消 
  modalCancel: function(e) {
    console.log(e)
    this.setData({
      showModal: false
    })
  },


  onLoad: function(a) {
    var that = this;
    this.getData()
  },

});