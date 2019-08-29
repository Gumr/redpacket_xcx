// pages/invite/invite.js
import WxService from "../../service/WxService";
const wxService = new WxService();
import RedService from "../../service/RedService";
const redService = new RedService();
const app = getApp();
import {
  BASE_URL
} from "../../utils/http";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channelNo: app.globalData.channelNo,
    image_cache: app.globalData.image_cache,
    backimg: "", //需要https图片路径
    head: "", //头像
    codeSrc: '',
    name: '', //姓名
    showBtn: false,
    activityType: '',//活动类型
    modal: false,
    radarImg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activityType: options.activityType ? options.activityType : ''
    },() =>{
      this.getCodeSrc();
    })
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

  },

  getCodeSrc: function() {
    var that = this;
    redService
      .getUserShareMsg({
        channel: app.globalData.channelNo,
        activityType: that.data.activityType ? that.data.activityType : 2
      }).then(res => {
        that.setData({
          codeSrc: res.data.qrcodeShortUrl
        }, () => {
          that.make();
        })
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
      })
  },

  make: function() {
    this.setData({
      backimg: this.data.activityType == '1' ? this.data.image_cache + 'redbg.png' : this.data.image_cache + 'giftbg.png',
      head: app.getUserInfo().avatarUrl,
      name: app.getUserInfo().nickName.length > 4 ? app.getUserInfo().nickName.substring(0, 4) + '...' : app.getUserInfo().nickName.substring(0, 4),
    }, () => {
      this.getbackimgInfo();
    })
  },


  /**
   * 先下载背景图片
   */
  getbackimgInfo: function() {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wxService.downloadFile(that.data.backimg)
      .then(res => {
        var backimgSrc = res.tempFilePath; //下载成功返回结果
        that.gethead(backimgSrc); //继续下载二维码图片
      })
  },

  /**
   * 下载头像图片
   */
  gethead: function(backimgSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wxService.downloadFile(that.data.head)
      .then(res => {
        var headSrc = res.tempFilePath;
        that.getCode(backimgSrc, headSrc); //继续下载二维码图片
      })
  },

  // 下载小程序码图片
  getCode: function(backimgSrc, headSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    var codeUrl = that.data.codeSrc;
    wxService.downloadFile(codeUrl)
      .then(res => {
        var codeSrc = res.tempFilePath;
        that.sharePosteCanvas(backimgSrc, headSrc, codeSrc);
      })
  },


  /**
   * 开始用canvas绘制分享海报
   * @param backimgSrc 下载的头像图片路径
   * @param headSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function(backimgSrc, headSrc, codeSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function(rect) {
      var height = rect.height;
      var right = rect.right;
      var width = rect.width;
      // console.log(width)
      var left = rect.left;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //背景图
      if (backimgSrc) {
        const x = 0;
        const y = 0;
        const w = width;
        const h = height;
        const r = width * 0.02;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(backimgSrc, x, y, w, h);
        ctx.restore();
      }

      //姓名
      if (that.data.name) {
        ctx.setFontSize(10);
        ctx.setFillStyle('rgba(255,255,255,1)');
        ctx.setTextAlign('left');
        ctx.fillText(that.data.name, width * 0.396, height * 0.06545);
        ctx.setStrokeStyle('#fff')
        ctx.stroke(); //对当前路径进行描边
        ctx.closePath(); //关闭当前路径
      }

      //  绘制头像
      if (headSrc) {
        const x = width * 0.05333;
        const y = height * 0.03748;
        const w = width * 0.128;
        const h = width * 0.128;
        const r = 2;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(headSrc, x, y, w, h);
        ctx.restore();
      }

      if (codeSrc) {
        const x = width * 0.1466;
        const y = height * 0.83508;
        const w = width * 0.2;
        const h = width * 0.2;
        const r = width * 0.026;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(codeSrc, x, y, w, h);
        ctx.restore();
      }

      // 显示保存按钮
      that.setData({
        showBtn: true
      })

    }).exec()

    setTimeout(function() {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              that.setData({
                modal: true,
                radarImg: tempFilePath
              })
            },
            fail: function(res) {
              that.setting()
            }
          })
        }
      });
    }, 200);
  },

  // 拒绝授权打开设置
  setting: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        var statu = res.authSetting;
        if (!statu['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '保存图片需开启权限',
            content: '请确认授权，否则将无法保存图片',
            showCancel: false,
            confirmColor: 'rgba(245, 175, 83, 1)',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后，再调用保存相册
                      that.saveShareImg()
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
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '调用授权窗口失败',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  copy: function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.activityType == '1' ? '争做红包达人，体游撒现金红包！最高999元锦鲤红包等你开！' : '争做礼包达人，体游赠送实物大礼包啦！最高iPhone X 128G / SK - II 护肤套装礼包等你来开！',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            that.setData({
              modal: false,
            })
          }
        })
      }
    });
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
})