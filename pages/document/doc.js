

var WxParse = require('../wxParse/wxParse.js');

var article = '<div style="background:red;">我是HTML代码</div>';

// doc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    console.log(article);

    var that = this;
    WxParse.wxParse('article', 'html', article, that, 5);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})