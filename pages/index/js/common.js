var timer = require('./counttimer.js');
//当前对象
var indexPage={
  "page":null,
  "allApp":null,
  "openID":null,
  "checkTimer":null,
  //登录主逻辑
  "login": function (page, myApp){
    //赋值数据
    this.page = page;
    this.allApp = myApp;
    var _that=this;
    //获取登录状态
    wx.login({
      success: function (res) {
        var parmData = res.code;
        if (res.code) {
          //调用应用实例的方法获取全局数据
          myApp.getUserInfo(function (userInfo) {
            //更新数据
            page.setData({
              userInfo: userInfo
            })
            //登录以后
            //code 换取 session_key
            _that.codeTopID(parmData, userInfo);
          })
        } else {
          wx.showModal({
            title: '早起打卡赢收益',
            content: '网络错误,请稍后重试！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          wx.hideLoading();
        }
      },
      fail:function(){
        wx.showModal({
          title: '早起打卡赢收益',
          content: '网络错误,请稍后重试！',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        wx.hideLoading();
      }
    });
  },
  // code代码获取openid
  "codeTopID": function (baseData, userInfo) {
      var _that=this;
      var m_appId = "wx914b559cf6043d41";
      var m_secret = "04c4b58693fadbd0a8f20deb3effedef";
      var m_js_code = baseData;
      var url = this.allApp.baseUrl + "authorize";
      wx.request({
        url: url,
        method:'POST',
        header: {
          'content-type': 'application/json'
        },
        data:{
          appid:m_appId,
          secret:m_secret,
          js_code:m_js_code
        },
        success: function (res) {
          //openid赋值
          _that.openID = res.data.openid

          //存储到app实例
          _that.allApp.openId = res.data.openid

          //数据存储
          _that.postUserInfo(_that.openID, userInfo);
        },
        fail: function () {
          wx.hideLoading();
        }
      })
  },
  // 发送用户数据到后台
  "postUserInfo": function (codeToID, userInfo){

    var _that=this;
    //请求
    var url = this.allApp.baseUrl +"recordUser"
    wx.request({
      url: url,
      data: {
        openid:codeToID,
        nickname: userInfo.nickName,
        headimgurl:userInfo.avatarUrl
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        //已经支付过
        if (res.data.backinfo.countDown){
          //支付成功，保存一个本地信息
          wx.setStorage({
            key: "payData",
            data: "true"
          })
          _that.rendTimerTos(res.data.backinfo.countDown);
        }else{
          _that.page.setData({
            countDown:null
          })
        }
      }
    })
  },
  // 支付
  "readyPayClock":function(){

    if (this.payFalg==false){
      return false;
    }
    wx.showLoading({
      title: '准备支付',
    })
    this.payFalg = false;
    var m_appId ="wx914b559cf6043d41";
    var m_mchId ="1488036512";  
    var m_appkey ="b6dPaePxItKZHzTofyOwTEFjIWxBGXbc";
    var m_paymoney=1;
    var _that=this;
    //请求
    var url = this.allApp.baseUrl + "wxPay"
    wx.request({
      url: url,
      data: {
        appId: m_appId,
        mchId: m_mchId,
        appKey: m_appkey,
        paymoney: m_paymoney,
        openid:_that.openID
      },
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.setStorage({
          key: "payData",
          data: "true"
        })
        _that.rendTimerTos(res.data.backinfo.countDown);
        wx.hideLoading();
        return false;

        //支付程序
        var parmData={
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'paySign': res.data.data.paySign,
          'orderId': res.data.data.orderId
        }
       // _that.payNow(parmData)
      },
    })
  },
  // 开始支付
  "payFalg":true,
  "payNow":function(payData){
    wx.hideLoading();
    var _that=this;
    wx.requestPayment({
      'timeStamp': payData.timeStamp,
      'nonceStr': payData.nonceStr,
      'package': payData.package,
      'signType': 'MD5',
      'paySign': payData.paySign,
      'success':function(res){
        _that.payFalg = true;
        //支付成功回调
        _that.paySuccess(payData.orderId);
      },
      'fail':function(res){
        _that.payFalg = true;
      }
    })
  },
  // 支付成功回调
  "paySuccess":function (m_orderId){
    //请求
    var _that=this;
    var url = this.allApp.baseUrl + "wxPayCallBack"
    wx.request({
      url: url,
      data: {
        orderId: m_orderId,
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //支付成功，保存一个本地信息
        wx.setStorage({
          key: "payData",
          data: "true"
        })
        _that.rendTimerTos(res.data.data.countDown);
      }
    })

  },
  //打卡
  "clocNow":function(){
    if (this.page.data.allowCar==false){
      return false;
    }
    wx.showLoading({
      title: '打卡中',
    })
    var _that = this;
    var url = this.allApp.baseUrl + "addPunch"
    wx.request({
      url: url,
      data: {
        openid: _that.openID
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '打卡成功',
        })
        wx.setStorage({
          key: "payData",
          data: "false"
        })
        _that.page.setData({
          countDown: null
        })   
      
      }
    })

  },
  //倒计时
  "rendTimerTos": function (pram_timer){
    var _that=this;
    var wxTimer = new timer({
      beginTime: pram_timer,
      complete: function () {
        _that.page.setData({
          countDown:"打卡",
          allowCar:true
        })
      },
      interval: 2,
      intervalFn: function () {
        // console.log(_that.page.data.wxTimer);
        var showStart = _that.page.data.wxTimer.split(":");
        _that.page.setData({
          countDown: showStart[0] + "小时" + showStart[1] + "分" + showStart[2] + "秒" + "后可以打卡"
        })
      }
    })
    wxTimer.start(this.page);
    this.checkTimer = wxTimer;
  }

}
export default indexPage



  