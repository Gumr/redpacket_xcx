// pages/prize/prize.js
const app = getApp();
import RedService from "../../service/RedService";
const redService = new RedService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 0,
    pageSize: 10,
    more: true,
    awardList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      pageNo: 0,
      more: true,
      awardList: [],
    },() =>{
      this.init()
    })
  },

  init: function(){
    var that = this;
    if (that.data.more == false) {
      return
    }
    that.data.pageNo++;
    redService
      .giftpage({
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      }).then(res => {
        var new_list = that.data.awardList.concat(res.data.list)
        that.setData({
          awardList: new_list
        })
        if (res.data.list.length < that.data.pageSize) {
          that.setData({
            more: false
          })
        }
      })
      .catch(err => {
        
      })
  },

  address: function(e){
    wx.navigateTo({
      url: '../address/address?param=' + e.currentTarget.dataset.param,
    })
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
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})