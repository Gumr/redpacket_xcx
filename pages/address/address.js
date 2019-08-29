// pages/address/address.js
var app = getApp()
import RedService from "../../service/RedService";
const redService = new RedService();


Page({
  data: {
    isIpx: app.globalData.isIpx,
    person: {},
    edit: false,//编辑/增加
  },

  onLoad: function(options) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    that.setData({
      person: prevPage.data.awardList[options.param]
    })
    if (that.data.person.expressReceiver){
      wx.setNavigationBarTitle({
        title: '编辑收货信息',
      })
      that.setData({
        edit: true,
      })
    }else{
      wx.setNavigationBarTitle({
        title: '添加收货信息',
      })
    }

  },
  // ------------------- 分割线 --------------------
  onReady: function() {
 
  },

  info_1: function(e){
    this.setData({
      ["person.expressReceiver"]: e.detail.value
    })
  },

  info_2: function (e) {
    this.setData({
      ["person.expressPhone"]: e.detail.value
    })
  },

  info_3: function (e) {
    console.log(e)
    this.setData({
      ["person.expressAddress"]: e.detail.value,
    })
  },

  getAddress: function(){
    const that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              console.log(res)
              that.setData({
                ["person.expressReceiver"]: res.userName,
                ["person.expressPhone"]: res.telNumber,
                ["person.expressProvince"]: res.provinceName,
                ["person.expressCity"]: res.cityName,
                ["person.expressDistrict"]: res.countyName,
                ["person.expressAddress"]: res.detailInfo,
              })
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.address']){
                  wx.chooseAddress({
                    success(res) {
                      that.setData({
                        ["person.expressReceiver"]: res.userName,
                        ["person.expressPhone"]: res.telNumber,
                        ["person.expressProvince"]: res.provinceName,
                        ["person.expressCity"]: res.cityName,
                        ["person.expressDistrict"]: res.countyName,
                        ["person.expressAddress"]: res.detailInfo,
                      })
                    }
                  })
                }
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                that.setData({
                  ["person.expressReceiver"]: res.userName,
                  ["person.expressPhone"]: res.telNumber,
                  ["person.expressProvince"]: res.provinceName,
                  ["person.expressCity"]: res.cityName,
                  ["person.expressDistrict"]: res.countyName,
                  ["person.expressAddress"]: res.detailInfo,
                })
              }
            })
          }
        }
      }
    })
  },

  sure: function(){
    var that = this;
    redService
      .address({
        userGiftId: that.data.person.userGiftId,
        expressReceiver: that.data.person.expressReceiver,
        expressPhone: that.data.person.expressPhone,
        expressProvince: that.data.person.expressProvince,
        expressCity: that.data.person.expressCity,
        expressDistrict: that.data.person.expressDistrict,
        expressAddress: that.data.person.expressAddress,
      }).then(res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
        })
        wx.navigateBack({
          
        })
      })
      .catch(err => {

      })
  },
  onReachBottom: function() {
    
  },
})
