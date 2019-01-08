var app = getApp();

Page({
  data: {
    showModal: false,
    shikigamiID: '',
    num: 0,
    canEx: true,
    canSell: false,
    canBuy: false,
    activeIndex: 'ssr',
    type: ['ssr', 'sp', '联动'],
    shikigami: {},
    shikigamiByType: [],
    shikigamiAll: [],
    myAssets: [],
    want: '315',
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

    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', uid)
    Fragment.setQuery(query).select(['shikigami', 'num', 'canEx', 'canSell']).find().then(res => {
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

        for (var i in that.data.shikigamiAll) {
          for (var j in that.data.myAssets) {
            if (that.data.shikigamiAll[i].num == that.data.myAssets[j].shikigami) {
              that.data.shikigamiAll[i].fragNum = that.data.myAssets[j].num
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
        }

        that.setData({
          shikigami: {
            'ssr': ssr,
            'sp': sp,
            '联动': ld
          }
        })

        if (that.data.activeIndex == 'ssr') {
          that.setData({
            shikigamiByType: that.data.shikigami.ssr
          })
          wx.hideLoading()
        }
        if (that.data.activeIndex == 'sp') {
          that.setData({
            shikigamiByType: that.data.shikigami.sp
          })
          wx.hideLoading()
        }
        if (that.data.activeIndex == '联动') {
          that.setData({
            shikigamiByType: that.data.shikigami['联动']
          })
          wx.hideLoading()
        }

      }, err => {
        // err 
        console.error(err)
      })


      // //查找所有ssr 
      // let ssr = new wx.BaaS.Query()
      // ssr.compare('type', '=', 'ssr')
      // shikigami.setQuery(ssr).limit(50).find().then(res => {
      //   // success 
      //   that.data.shikigami.ssr = res.data.objects
      //   that.data.shikigamiAll.concat(res.data.objects)

      //   for (var i in that.data.shikigami.ssr) {
      //     for (var j in that.data.myAssets) {
      //       if (that.data.shikigami.ssr[i].num == that.data.myAssets[j].shikigami) {
      //         that.data.shikigami.ssr[i].fragNum = that.data.myAssets[j].num
      //       }
      //     }
      //   }
      //   if (that.data.activeIndex == 'ssr') {
      //     that.setData({
      //       shikigamiByType: that.data.shikigami.ssr
      //     })
      //     wx.hideLoading()
      //   }

      // }, err => {
      //   // err 
      //   console.error(err)
      // })


      // //查找所有sp 
      // let sp = new wx.BaaS.Query()
      // sp.compare('type', '=', 'sp')
      // shikigami.setQuery(sp).limit(50).find().then(res => {
      //   // success 
      //   that.data.shikigami.sp = res.data.objects
      //   that.data.shikigamiAll.concat(res.data.objects)

      //   for (var i in that.data.shikigami.sp) {
      //     for (var j in that.data.myAssets) {
      //       if (that.data.shikigami.sp[i].num == that.data.myAssets[j].shikigami) {
      //         that.data.shikigami.sp[i].fragNum = that.data.myAssets[j].num
      //       }
      //     }
      //   }
      //   if (that.data.activeIndex == 'sp') {
      //     that.setData({
      //       shikigamiByType: that.data.shikigami.sp
      //     })
      //     wx.hideLoading()
      //   }
      // }, err => {
      //   // err 
      //   console.error(err)
      // })

      // //查找所有联动 
      // let ld = new wx.BaaS.Query()
      // ld.compare('type', '=', '联动')
      // shikigami.setQuery(ld).limit(50).find().then(res => {
      //   // success 
      //   that.data.shikigami['联动'] = res.data.objects
      //   that.data.shikigamiAll.concat(res.data.objects)

      //   for (var i in that.data.shikigami['联动']) {
      //     for (var j in that.data.myAssets) {
      //       if (that.data.shikigami['联动'][i].num == that.data.myAssets[j].shikigami) {
      //         that.data.shikigami['联动'][i].fragNum = that.data.myAssets[j].num
      //       }
      //     }
      //   }
      //   if (that.data.activeIndex == '联动') {
      //     that.setData({
      //       shikigamiByType: that.data.shikigami['联动']
      //     })
      //     wx.hideLoading()
      //   }
      // }, err => {
      //   // err 
      //   console.error(err)
      // })


    }), err => {
      //err 为 HError 对象
      console.log(err)
      wx.showToast({
        title: 'err',
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
      if(res.data.meta.total_count){
        let recordID = res.data.objects[0].id
        let member = Membership.getWithoutData(recordID)
        member.set({
          canBuy: that.data.canBuy,
          want: that.data.want
        })
        member.update().then(res => {
          // success
          wx.showToast({
            title: '已保存',
            icon: 'success',
            duration: 2000
          })
        }, err => {
          // err
          console.log(err)
          wx.showToast({
            title: '失败',
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
      wantIndex: e.detail.value
    })
  },
  onChangePY: function (e) {
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
      canEx: true,
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

  //是否交换 
  onChangeEx: function(e) {
    console.log(e)
    this.setData({
      canEx: e.detail.value
    })
  },

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
    let uid = wx.BaaS.storage.get("uid")

    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', uid)
    query.compare('shikigami', '=', this.data.shikigamiID)

    //查询是否有记录
    Fragment.setQuery(query).find().then(res => {

      //如果没有登记过，新建记录
      if (res.data.meta.total_count == 0) {
        let asset = Fragment.create()
        asset.set({
          shikigami: this.data.shikigamiID,
          num: this.data.num,
          canEx: this.data.canEx,
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
          //err 为 HError 对象
          console.log(err)
          wx.showToast({
            title: 'err',
          })
        })
      } else {
        //如果已有记录就更新
        var recordID = res.data.objects[0].id
        let asset = Fragment.getWithoutData(recordID)
        asset.set({
          shikigami: this.data.shikigamiID,
          num: this.data.num,
          canEx: this.data.canEx,
          canSell: this.data.canSell
        })
        asset.update().then(res => {
          // success
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