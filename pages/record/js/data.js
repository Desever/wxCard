var clearData={


  //绘制canvas
  "drawCanvas":function(){

    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')

    console.log(context.height)

    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 250, 250)
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },
  //获取我的战绩
  "getWeData":function(allApp,thisPage){
    var url = allApp.baseUrl + "myMilitary";
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: allApp.openId,
      },
      success: function (res) {
        thisPage.setData({
          battle: res.data.data
        });
        console.log(res.data.data);
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
      }
    })

  }


}
export default clearData;