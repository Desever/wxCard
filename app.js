//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //基本接口
  //baseUrl:"https://www.kaquantong.cn/web/punchIn/",

  baseUrl:"http://192.168.0.105:3000/",
  openId:"",
  getUserInfo: function(cb,test) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          //等待
          wx.showLoading({
            title: '加载中',
          }) 
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail:function(){
          wx.showModal({
            title: '早起打卡赢收益',
            content: '获取用户信息失败，请重新授权',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      wx.getUserInfo({
                        withCredentials: false,
                        success: function (res) {
                          //等待
                          wx.showLoading({
                            title: '加载中',
                          })
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        },
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          wx.hideLoading();

        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
