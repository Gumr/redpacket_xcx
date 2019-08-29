// pages/my/my.js
const app = getApp();
import RedService from "../../service/RedService";
const redService = new RedService();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channelNo: app.globalData.channelNo,
    adv: [],
    lampData: [],
    isLogin: false,
    user: null,
    balance: '', //余额
    showRecord: false,
    recordList: [], //好友助力记录
    pageNo: 0,
    pageSize: 15,
    more: true,
    withdraw: false, //提现弹窗
    withdrawList: [],
    amount: '', //提现金额
    feed_style: {
      x: "",
      y: "",
    }, //这个参数是定位使用的x ， y值
    screen: {
      width: "",
      height: ""
    }, // 用于保存屏幕页面信息
    preX: '', //上次的x值
    preY: '', //上次的y值
    btnWidth:'',//客服按钮宽
    btnHeight:'',//客服按钮高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.adv('1003');
    this.notice();
    this.screen()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    app.getLoginStatus(function(res) {
      that.setData({
        isLogin: res == true ? true : false
      })
      if (res == true) {
        that.init()
      }
    })
  },

  screen: function() {
    var that = this;
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: function(res) {
        // 可使用窗口宽度、高度
        that.setData({
          screen: {
            width: res.windowWidth,
            height: res.windowHeight,
            pixelRatio: res.pixelRatio,
            ratio: res.windowWidth * res.pixelRatio / 750
          }
        })
      }
    })
    
    query.select('.kefu').boundingClientRect(rect => {
      that.setData({
        btnWidth: rect.width,
        btnHeight: rect.height,
      })
    }).exec();

  },

  touchMoveChange(e) {
    var tmpx = parseInt(e.touches[0].clientX);
    var tmpy = parseInt(e.touches[0].clientY);
    if (tmpx - this.data.btnWidth/2 <= 0 || tmpy - this.data.btnHeight/2 <= 0 || tmpx >= this.data.screen.width - this.data.btnWidth/2 || tmpy >= this.data.screen.height - this.data.btnHeight/2) {

    } else {
      if (tmpx != this.data.preX || tmpy != this.data.preY) {
        this.data.preX = tmpx
        this.data.preY = tmpy
        this.setData({
          feed_style: {
            x: tmpx - this.data.btnWidth/2 + "px",
            y: tmpy - this.data.btnHeight/2 + "px",
          }
        })
      }
    }
  },

  adv: function(advType) {
    var that = this;
    redService
      .adv({
        advType: advType
      }).then(res => {
        if (advType == '1003') {
          that.setData({
            adv: res.data
          })
        }
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  advjump: function(e) {
    if (e.currentTarget.dataset.type == '1') {
      // 外链
      wx.navigateTo({
        url: '../webview/webview?url=' + e.currentTarget.dataset.url,
      })
    } else if (e.currentTarget.dataset.type == '2') {
      // 内链
      wx.navigateTo({
        url: '../' + e.currentTarget.dataset.url + '/' + e.currentTarget.dataset.url,
      })
    } else if (e.currentTarget.dataset.type == '3') {
      // 小程序
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
        path: e.currentTarget.dataset.url,
        success(res) {

        }
      })
    }
  },

  init: function() {
    var that = this;
    redService
      .info({

      }).then(res => {
        wx.hideLoading();
        that.setData({
          user: res.data
        })
        that.getUserBalance();
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  getUserBalance: function() {
    var that = this;
    redService
      .getUserBalance({

      }).then(res => {
        wx.hideLoading();
        that.setData({
          balance: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  login: function(e) {
    var that = this;
    if (e.detail.isLogin) {
      that.setData({
        isLogin: e.detail.isLogin
      })
    }
    that.init();
  },

  prize: function(e) {
    var that = this;
    // 给登录组件传递登录状态
    if (e.detail.isLogin) {
      that.init();
      that.setData({
        isLogin: e.detail.isLogin
      })
    }
    wx.navigateTo({
      url: '../prize/prize',
    })
  },

  record: function(e) {
    var that = this;
    // 给登录组件传递登录状态
    if (e.detail.isLogin) {
      that.init();
      that.setData({
        isLogin: e.detail.isLogin
      })
    }
    if (e.currentTarget.dataset.status == 'init') {
      that.setData({
        pageNo: 1,
        more: true,
        recordList: [],
      })
    }
    if (that.data.more == 'false') {
      return
    }
    e.currentTarget.dataset.status == 'init' ? that.data.pageNo : that.data.pageNo++
      redService
      .invite({
        pageNo: e.currentTarget.dataset.status == 'init' ? '1' : that.data.pageNo,
        pageSize: that.data.pageSize
      }).then(res => {
        if (e.currentTarget.dataset.status == 'init' && res.data.list.length == 0) {
          wx.showToast({
            title: '暂无助力记录',
            icon: 'none',
          })
          return
        }
        if (res.data.list.length < that.data.pageNo) {
          that.setData({
            more: 'false'
          })
        }
        var new_list = that.data.recordList.concat(res.data.list)
        that.setData({
          showRecord: true,
          recordList: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  lower: function(e) {
    this.record(e);
  },

  close: function() {
    this.setData({
      showRecord: false,
      withdraw: false,
    })
  },

  withdraw: function() {
    var that = this;
    redService
      .getWithdrawAmount({

      }).then(res => {
        that.setData({
          withdraw: true,
          withdrawList: res.data,
          amount: res.data[0].amount,
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  select: function(e) {
    this.setData({
      amount: e.currentTarget.dataset.amount,
    })
  },

  sure: function() {
    var that = this;
    redService
      .withdraw({
        withdrawAmount: that.data.amount
      }).then(res => {
        wx.showToast({
          title: '提现成功',
          icon: 'success'
        })
        that.setData({
          withdraw: false,
        })
      })
      .catch(err => {
        that.setData({
          withdraw: false,
        })
      })
  },

  bindGetPhoneNumber: function(e) {
    var that = this;
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      // 拒绝授权
      return;
    }
    if (app.globalData.isConnected) {
      loginService
        .wxMaBindPhone({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }).then(res => {
          wx.hideLoading();
          that.setData({
            ['user.phone']: true
          })
          that.withdraw()
        })
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },

  notice: function() {
    var that = this;
    redService
      .notice({

      }).then(res => {
        that.setData({
          lampData: res.data
        }, () => {
          that.setData({
            showLamp: true
          })
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
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
  onShareAppMessage: function() {

  }
})