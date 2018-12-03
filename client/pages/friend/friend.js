// client/pages/friend/friend.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    friendList: [],
    userInfo: {},
    portrait_temp: '',
    qrcode_temp: '',
    qrcode_url: '',
    windowHeight: 300,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < 22; i++) {
      that.data.friendList.push({
        id: "ID" + i,
        avatarUrl: '../../images/default_avatar.png',
        nickName: "小布",
        realName: "王宇",
        userLabel: "朋友",
        status: 0,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
        isTouchMove: false //默认隐藏删除
      })
    }
    that.setData({
      friendList: that.data.friendList,
      userInfo: app.globalData.userInfo,
      windowHeight: app.globalData.phoneInfo.windowHeight
    })
    console.log(app.globalData.userInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.qrcodeget();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    this.downloadFile();
    return {
      title: '我的小程序',
      path: 'pages/today/today',
      imageUrl: '',
      success: function(res) {
        // 转发成功
        console.log("转发成功", res);
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
  },
  downloadFile: function() {
    var that = this;
    var url = app.globalData.userInfo.avatarUrl;
    console.log("头像地址", url);
    wx.downloadFile({
      url: url,
      success: function(res1) {
        console.log(res1);
        //缓存头像图片
        that.setData({
          portrait_temp: res1.tempFilePath
        })
        //缓存canvas绘制小程序二维码
        wx.downloadFile({
          url: that.data.qrcode_url,
          success: function(res2) {
            console.log('二维码：' + res2.tempFilePath)
            //缓存二维码
            that.setData({
              qrcode_temp: res2.tempFilePath
            })
            console.log('开始绘制图片')
            that.drawImage();
            wx.hideLoading();
            setTimeout(function() {
              that.canvasToImage()
            }, 200)
          }
        })
      }
    })
  },

  qrcodeget: function() {
    wx.request({
      // 获取token
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
      data: {
        appid: 'wx1465f9a62bfea385',
        secret: '7d68daf0fd22f23d280bfa17d09a9618'
      },
      success(res) {
        console.log("access_token", res);
        // console.log("获取小程序二维码", re);
        // wx.request({
        //   // 调用接口C
        //   url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + res.data.access_token,
        //   method: 'POST',
        //   data: {
        //     "path": "pages/today/today",
        //     "width": 430
        //   },
        //   success(res) {
        //     console.log("获取小程序二维码", res);
        //   }
        // })
      }
    })
  },
  drawImage: function() {
    //绘制canvas图片
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = '../../images/背景.png';
    var portraitPath = that.data.portrait_temp
    var hostNickname = app.globalData.userInfo.nickName

    var qrPath = that.data.qrcode_temp
    var windowWidth = app.globalData.phoneInfo.windowWidth
    that.setData({
      scale: 1.6
    })
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, that.data.scale * windowWidth)
    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 正在参加疯狂红包活动', windowWidth / 2, 0.52 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('邀请你一起来领券抢红包啦~', windowWidth / 2, 0.57 * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    //绘制第三段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码领红包', windowWidth / 2, 1.36 * windowWidth)
    ctx.draw();
  },
  canvasToImage: function() {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.windowWidth,
      height: that.data.windowWidth * that.data.scale,
      destWidth: that.data.windowWidth * 4,
      destHeight: that.data.windowWidth * 4 * that.data.scale,
      canvasId: 'myCanvas',
      success: function(res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function(err) {
        console.log('失败')
        console.log(err)
      }
    })
  },
})