// const wxParser = require('../../wxParser/index')

Page({
  data: {
    contents: {}
  },

  onClick: function(e) {
    console.log(e.target)
    wx.navigateTo({
      url: '/pages/testpage/testpage?id=' + e.target.id + "&groupid=" + e.target.dataset.groupid,
    })

  },

  onLoad: function(options) {
    let that = this
    console.log(options)
    let groupid = options.groupid
    
    let contentid = parseInt(options.contentid)

    if (contentid) {
      let query = new wx.BaaS.Query()
      query.arrayContains('id', [categoryid])
      let ContentGroupTest = new wx.BaaS.ContentGroup(groupid)

      ContentGroupTest.setQuery(query).find().then(res => {
        // success
        console.log(res.data)
        that.setData({
          contents: res.data.objects
        })
      }, err => {
        // err
        console.log(err)
      })
    }







  }
})