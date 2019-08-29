const QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'ZGSBZ-3VUC4-FQ6UR-DEM36-EBXBS-UOF42' // 必填
});


function getCity(callBack) {
  var _this = this;
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      locationMt(res.latitude, res.longitude, callBack)
    },
    fail: function(res) {
      // 拒绝授权打开设置
      setting(callBack);
    }
  })
}

// 拒绝授权打开设置
function setting(callBack) {
  var _this = this;
  wx.getSetting({
    success: function(res) {
      var statu = res.authSetting;
      if (!statu['scope.userLocation']) {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则部分功能将无法使用',
          showCancel: false,
          confirmColor: '#0075ff',
          success: function(tip) {
            if (tip.confirm) {
              wx.openSetting({
                success: function(data) {
                  if (data.authSetting["scope.userLocation"] === true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //授权成功之后，再调用chooseLocation选择地方
                    wx.getLocation({
                      type: 'wgs84',
                      success: function(res) {
                        locationMt(res.latitude, res.longitude, callBack)
                      },
                    })
                  } else {
                    setting(callBack);
                    // wx.showToast({
                    //   title: '授权失败',
                    //   icon: 'success',
                    //   duration: 1000
                    // })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '授权失败',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
      } else {
        //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
        wx.showModal({
          title: '',
          content: '请在系统设置中打开定位服务',
          confirmText: '确定',
          showCancel: false,
          confirmColor: '#0075ff',
          success: function(res) {

          }
        })
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '调用授权窗口失败',
        icon: 'success',
        duration: 1000
      })
    }
  })
}

// 城市定位
function locationMt(latitude, longitude, callBack) {
  var that = this;
  // 定位自己的城市，需要引入第三方api
  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success: function(res) {
      callBack(res)
    },
    fail: function(res) {
      //定位失败
    }
  })
}

module.exports = {
  getCity: getCity,
  setting: setting,
  locationMt: locationMt
}