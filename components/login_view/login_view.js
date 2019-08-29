import LoginService from "../../service/LoginService";
const loginService = new LoginService();
import WxService from "../../service/WxService";
const wxService = new WxService();
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLogin: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: '',
  },

  ready: function() {
    var that = this;
    app.getLoginStatus(function (res) {
      if (res == false) {
        wxService
          .getCode()
          .then(code => {
            that.setData({
              code: code
            })
          })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleUserInfo: function(e) {
      console.log(e)
      var that = this;
      if (e.detail.errMsg != "getUserInfo:ok") {
        wx.showModal({
          title: "授权失败",
          content: "请重新操作",
          showCancel: false,
          onConfirm: () => {
            this.triggerEvent("onLoginFail", {});
          }
        });
      } else {
        const { userInfo } = e.detail;
        app.updateUserInfo(userInfo);//userInfo
        wx.showLoading({
          title: "登录中"
        });
        loginService
          .login({
            channelNo: app.globalData.channelNo,
            jscode: that.data.code,
            rawData: e.detail.rawData,
            signature: e.detail.signature,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          }).then(res => {
            wx.hideLoading();
            app.setLoginStatus(res.data.sid)
            this.triggerEvent("onLoginSuccess", {
              isLogin: true
            });
          })
          .catch(err => {
            wx.hideLoading();
            this.triggerEvent("onLoginFail", {
              err
            });
          })
      }
    },
    handleTap: function() {
      this.triggerEvent("onLoginSuccess", {
     
      });
    }
  }
})