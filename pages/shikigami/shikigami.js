var app = getApp();

Page({
  data: {
    activeIndex: 'ssr',
    type: ['ssr', 'sp', '联动','sr','皮肤'],
    shikigami: {
      'ssr':[],
      'sp':[],
      '联动':[],
      'sr':[],
      '皮肤':[]
    },
    shikigamiByType: [],
    dataIsLoaded: !1
  },

  changeActive: function(e) {
    console.log(e)
    var type = e.target.id
    this.setData({
      activeIndex: type,
      shikigamiByType: this.data.shikigami[type]
    });
  },
  onLoad: function(a) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    })
    let shikigami = new wx.BaaS.TableObject(61369)
    let ssr = new wx.BaaS.Query()

    //查找所有ssr
      ssr.compare('type', '=', 'ssr')
      shikigami.setQuery(ssr).limit(50).find().then(res => {
        // success
        
        that.data.shikigami.ssr = res.data.objects
        that.setData({
          dataIsLoaded: 1,
          shikigamiByType: that.data.shikigami.ssr
        })
        wx.hideLoading()
      }, err => {
        // err
        console.error(err)
      })


    //查找所有sp
    let sp = new wx.BaaS.Query()
    sp.compare('type', '=', 'sp')
    shikigami.setQuery(sp).limit(50).find().then(res => {
      // success
      that.data.shikigami.sp = res.data.objects
    }, err => {
      // err
      console.error(err)
    })
    
    //查找所有联动
    let ld = new wx.BaaS.Query()
    ld.compare('type', '=', '联动')
    shikigami.setQuery(ld).limit(50).find().then(res => {
      // success
      that.data.shikigami['联动'] = res.data.objects
    }, err => {
      // err
      console.error(err)
    })

    //查找所有sr    
    let sr = new wx.BaaS.Query()
    sr.compare('type', '=', 'sr')
    shikigami.setQuery(sr).limit(50).find().then(res => {
      // success
      that.data.shikigami['sr'] = res.data.objects
    }, err => {
      // err
      console.error(err)
    })

    //查找所有皮肤
    let skin = new wx.BaaS.Query()
    skin.compare('type', '=', '皮肤')
    shikigami.setQuery(skin).limit(50).find().then(res => {
      // success
      that.data.shikigami['皮肤'] = res.data.objects
    }, err => {
      // err
      console.error(err)
    })

  },

});