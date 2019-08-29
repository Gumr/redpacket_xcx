//index.js
const app = getApp();
const location = require('../../libs/js/location.js');
import RedService from "../../service/RedService";
const redService = new RedService();

Page({
  data: {
    city_code:'',
    banner:[],//轮播
    weal:[],//福利
    lampData: [],
    showNewpacket: false, //显示新人红包
    openBag: false, //打开新人红包
    openAgain: false, //再开四个红包
    isLogin: false,
    rule: false, //规则
    throttle: false, //红包抖动
    dayList: [], //天天领红包list
    newList: [], //新人领红包
    clickIndex: 0, //点击红包的下标
    formId: [],
    boxList: ['','','','','','','','',''],
    unlockTime: '',//下次解锁时间
    newGroup: '',//是否新的一轮
    openNum: '',//可以开启次数
    dot: false, //礼物初始化
    blackBox: false,
    showGift: false, //显示礼物弹窗
    award: null,//礼物奖品
    openGift: false,//礼物打开
    k1: false,
    k2: false,
    remainHours: '',//礼包解锁时间
    remainMin: '',//礼包解锁时间
  },
  onLoad: function() {
    var that = this;
    location.getCity(function(res) {
      that.setData({
        city_code: res.result.ad_info.city_code
      })
    })
    that.init('1001'); //活动首页轮播
    that.init('1002'); //活动首页福利
    that.notice()
  },
  onShow: function() {
    var that = this;
    app.getLoginStatus(function(res) {
      that.setData({
        isLogin: res == true ? true : false
      })
    })
  },
  onReady: function() {
    
  },

  weal: function(e){
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

  rule: function() {
    this.setData({
      rule: true,
    })
  },
  packet: function(e) {
    var that = this;
    // 给登录组件传递登录状态
    that.setData({
      isLogin: e.detail.isLogin ? e.detail.isLogin : that.data.isLogin
    })
    if (that.data.city_code != "156440300") {
      wx.showToast({
        title: '活动仅限深圳地区',
        icon: 'none',
      })
      return
    }
    redService
      .getRedPacket({
        redPacketType: '1'
      }).then(res => {
        wx.hideLoading();
        that.setData({
          showNewpacket: res.data[0].receiveStatus == '1' ? false : true,
          newList: res.data
        })
        if (res.data[0].receiveStatus == '1') {
          wx.showToast({
            title: '红包已经领取过啦',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        wx.hideLoading();
      })
    // 传递 formid
    setTimeout(() => {
      if (that.data.isLogin && that.data.formId.length > 0) {
        that.formId()
      }
    }, 1000)
  },
  close: function() {
    this.setData({
      showNewpacket: false,
      openBag: false,
      openAgain: false,
      rule: false,
      showGift: false,
      blackBox: false,
      dot: false,
    })
  },
  open: function(e) {
    var that = this;
    redService
      .openRedPacket({
        userRedPacketId: e.currentTarget.dataset.redpacketid
      }).then(res => {
        wx.hideLoading();
        that.setData({
          ['newList[0].redPacketAmount']: res.data.redPacketAmount,
          openBag: true,
          showNewpacket: false
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },
  openAgain: function(e) {
    var that = this;
    // 给登录组件传递登录状态
    that.setData({
      isLogin: e.detail.isLogin ? e.detail.isLogin : that.data.isLogin
    })
    if (that.data.city_code != "156440300") {
      wx.showToast({
        title: '活动仅限深圳地区',
        icon: 'none',
      })
      return
    }
    redService
      .getRedPacket({
        redPacketType: '2'
      }).then(res => {
        wx.hideLoading();
        var list = res.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].inviteUnlockStatus == '1') {
            list[i].unlockStatus = '1';
          } else {
            if (new Date(list[i].unlockTime.replace(/\-/g, '/')).getTime() > new Date().getTime()) {
              // 开锁总秒数
              var second = (new Date(list[i].unlockTime.replace(/\-/g, '/')).getTime() - new Date().getTime()) / 1000
              list[i].unlockStatus = '0';
              list[i].remainHours = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600);
              list[i].remainMin = Math.floor((second / 60 % 60)) < 10 ? '0' + Math.floor((second / 60 % 60)) : Math.floor((second / 60 % 60));
            } else {
              list[i].unlockStatus = '1'
            }
          }
        }
        // console.log(list)
        that.setData({
          dayList: list,
        }, () => {
          that.setData({
            openBag: false,
            showNewpacket: false,
            openAgain: true,
          })
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
    // 传递 formid
    setTimeout(() => {
      if (that.data.isLogin && that.data.formId.length > 0) {
        that.formId()
      }
    }, 1000)
  },
  throttle: function(e) {
    var that = this;
    that.setData({
      throttle: true,
      clickIndex: e.currentTarget.dataset.index,
    })
    setTimeout(() => {
      that.setData({
        throttle: false,
      }, () => {
        if (e.currentTarget.dataset.unlockstatus == '1' && e.currentTarget.dataset.receivestatus == '0') {
          redService
            .openRedPacket({
              userRedPacketId: e.currentTarget.dataset.redpacketid
            }).then(res => {
              var list = that.data.dayList;
              list[e.currentTarget.dataset.index].receiveStatus = '1';
              list[e.currentTarget.dataset.index].redPacketAmount = res.data.redPacketAmount;
              that.setData({
                dayList: list
              })
              wx.hideLoading();
            })
            .catch(err => {
              wx.hideLoading();
            })
        }
      })
    }, 500)
  },
  invite: function(e) {
    this.setData({
      openAgain: false,
      dot: false, //礼物初始化
      blackBox: false,
      showGift: false, //显示礼物弹窗
    }, () => {
      wx.navigateTo({
        url: '../invite/invite?activityType=' + e.currentTarget.dataset.type,
      })
    })
  },

  // 开礼品
  openGift: function(e){
    var that = this;
    // 给登录组件传递登录状态
    that.setData({
      isLogin: e.detail.isLogin ? e.detail.isLogin : that.data.isLogin
    })
    // 限制深圳地区
    if (that.data.city_code != "156440300"){
      wx.showToast({
        title: '活动仅限深圳地区',
        icon: 'none',
      })
      return
    }
    redService
      .giftinfo({
       
      }).then(res => {
        if (res.data.unlockTime){
          // 开锁总秒数
          var second = (new Date(res.data.unlockTime.replace(/\-/g, '/')).getTime() - new Date().getTime()) / 1000
          var remainHours = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600);
          var remainMin = Math.floor((second / 60 % 60)) < 10 ? '0' + Math.floor((second / 60 % 60)) : Math.floor((second / 60 % 60));
        }
        that.setData({
          boxList: res.data.newGroup ? res.data.giftList : that.data.boxList,
          unlockTime: res.data.unlockTime,//下次解锁时间
          remainHours: remainHours ? remainHours : '',
          remainMin: remainMin ? remainMin : '',
          newGroup: res.data.newGroup,//是否新的一轮
          openNum: res.data.openNum,//可以开启次数
          showGift: true,
        }, () => {
          // 新一组动效
          if(res.data.newGroup){
            this.setData({
              blackBox: false,
              dot: false,
            }, () => {
              setTimeout(function () {
                that.setData({
                  dot: true
                })
                setTimeout(() => {
                  that.setData({
                    blackBox: true,
                    dot: false,
                  })
                }, 1600)
              }, 1600)
            })
          }else{
            var list = res.data.giftList
            for(var i = 0;i<list.length;i++){
              var num = Number(list[i].giftGroupPos);
              var deletedTodo = "boxList[" + num + "]";
              // console.log(num)
              that.setData({
                [deletedTodo]: list[i]
              })
            }
          }
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
      // 传递 formid
      setTimeout(() =>{
        if (that.data.isLogin && that.data.formId.length > 0) {
          that.formId()
        }
      },1000)
  },

  formId: function(){
    var that = this;
    redService
      .submit({
        formId: that.data.formId[that.data.formId.length - 1]
      }).then(res => {
        
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  openBox: function(e){
    var that = this;
    redService
      .open({
        giftGroupPos: e.currentTarget.dataset.index
      }).then(res => {
        that.setData({
          award: res.data,
          showGift: false,
          blackBox: false,
          dot: false,
          openGift: true,
          k1: true,
        },() =>{
          setTimeout(() =>{
            that.setData({
              k1: false,
              k2: true,
            })
          },1200)
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  see: function(){
    this.setData({
      openGift: false,
      k1: false,
      k2: false,
    },()=>{
      wx.navigateTo({
        url: '../prize/prize',
      })
    })
  },

  again: function(){
    this.setData({
      openGift: false,
      k1: false,
      k2: false,
    },)
  },

  init: function (advType){
    var that = this;
    redService
      .adv({
        advType: advType
      }).then(res => {
        if(advType == '1001'){
          that.setData({
            banner: res.data
          })
        }else if(advType == '1002'){
          that.setData({
            weal: res.data
          })
        }
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  notice: function(){
    var that = this;
    redService
      .notice({
        
      }).then(res => {
        that.setData({
          lampData: res.data
        },() =>{
          that.setData({
            showLamp: true
          })
        })
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  catchSubmit: function(e) {
    // console.log(e.detail.formId)
    if (e.detail.formId) {
      this.data.formId.push(e.detail.formId)
    }
  }
})