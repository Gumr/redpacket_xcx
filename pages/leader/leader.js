// pages/leader/leader.js
const app = getApp();
const time = require('../../libs/js/time.js');
import RedService from "../../service/RedService";
const redService = new RedService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    isLogin: false,
    dayList:[],
    weekList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(1)
    this.init(2)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getLoginStatus(function (res) {
      that.setData({
        isLogin: res == true ? true : false
      })
    })
  },

  tab: function(e){
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },

  init: function(type){
    var that = this;
    redService
      .getShareLeaderboard({
        startTime: type == 1 ? time.startDate(new Date()) : time.calculateDate(new Date(),7),
        endTime: time.endDate(new Date()),
      }).then(res => {
        wx.hideLoading();
       if(type == 1){
         that.setData({
           dayList: res.data
         })
       }else{
         that.setData({
           weekList: res.data
         })
       }
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  login: function (e) {
    var that = this;
    if (e.detail.isLogin) {
      that.setData({
        isLogin: e.detail.isLogin
      })
    }
    that.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // }
})