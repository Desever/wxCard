
import home_com from './js/common.js';
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    showSuccess:"",
    textUrl:"",
    countDown:null,
    allowCar:false,
    wxTimerList:{},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //加载图片
  bindImgLoad:function(){
    setTimeout(function(){
      wx.hideLoading();
    },2000);

  },
  //打卡
  getJoin:function(){
    var _that=this;
    home_com.readyPayClock();
  },
  getClock:function(){
    home_com.clocNow();
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '分享给朋友，一起打卡',
      path: '/pages/index/index',
      imageUrl:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3846745244,3367462105&fm=27&gp=0.jpg",
      success: function (res) {
        console.log(res);
      }
    }
  },
  //跳转测试
  goNext:function(){
    wx.navigateTo({
      url: '../record/record'
    })
  },
  //跳转测试
  goNext2: function () {
    wx.navigateTo({
      url: '../clock/clock'
    })
  },

  //跳转测试
  goNext3: function () {
    wx.navigateTo({
      url: '../document/doc'
    })
  },

  //关闭打卡成功
  closeSuccess:function(){
    //显示modal
    this.setData({
      showSuccess:""
    });
  },
  //加载界面
  onLoad: function () {
    var _that=this;
    //获取本地支付信息
    wx.getStorage({
      key: 'payData',
      success: function (res) {
        if(res.data=="true"){
          _that.setData({
            countDown: "正在获取时间信息..."
          })
        }else{
          _that.setData({
            countDown: null
          })
        }
      }
    })
    //获取用户信息
    home_com.login(_that, app);
  },
  onShow:function(){
    if (home_com.checkTimer){
      wxTimer.calibration()
    }
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  } 
})
