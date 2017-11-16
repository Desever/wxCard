
import startData from './js/data.js';
// record.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    battle:{
      totalInto:0,
      totalInto:0,
      sucessPuch:0
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../record/record'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      //更新数据以后
      //获取用户的战绩
      startData.getWeData(app, that);
    })   
  },

  //保存到本地
  shareSave:function(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 250,
      height: 250,
      destWidth: 700,
      destHeight: 700,
      canvasId: 'firstCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '赫然科技',
              content: '你的战绩已经保存到相册，可以到朋友圈装逼了',
            })
          }
        })
      }
    })

  },
})