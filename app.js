//app.js
App({
  onLaunch: function() {
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    // 初次加载判断网络情况 无网络状态下根据实际情况进行调整
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /*监听网络状态变化可根据业务需求进行调整*/
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function() {}
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });


    // 获取设备信息
    wx.getSystemInfo({
      success(res) {
        let deviceModel = 'iPhone X';
        if (res.model.indexOf(deviceModel) > -1) {
          that.globalData.isIpx = true;
        }
      },
    });
  },
  getUserInfo: function (cb) {
    return wx.getStorageSync("userInfo");
  },
  setLoginStatus: function (sid) {
    return wx.setStorageSync('sid', sid);
  },
  getLoginStatus: function (callBack) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && wx.getStorageSync("sid")) {
          callBack(true)
        } else {
          callBack(false)
        }
      }
    })
  },
  updateUserInfo: function (userInfo) {
    return wx.setStorageSync("userInfo", userInfo);
  },
  globalData: {
    userInfo: null,
    isConnected: true,
    isIpx: '', //是否iPhone X
    channelNo: 'ty_redpacket',
    image_cache: 'https://client.tiyoukids.com/static/image/mnapp/',
  }
})