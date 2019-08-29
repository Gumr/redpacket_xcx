
const BASE_URL = "https://client.tiyoukids.com"; //生产环境
// const BASE_URL = "https://tclient.tiyoukids.com"; //测试环境

import WxService from "../service/WxService";
const wxService = new WxService();
const app = getApp();




const sideEffect = {
  beforeRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.showLoading({
        title: "" + options.loadingMsg,
        mask: true,
      });
    }
  },
  afterRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.hideLoading();
    }
  }
};

function filterParams(params) {
  let res = {};
  Object.keys(params).forEach(key => {
    if (params[key] === null || params === undefined) {
      return;
    }
    res[key] = params[key];
  });
  return res;
}


export function request(method, api, params = {}, options = {}) {
  sideEffect.beforeRequest(options);
  if (Object.prototype.toString.call(params) === '[Object Object]') {
    params = filterParams(params);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: (options.url || BASE_URL) + api,
      data: params,
      method,
      header: {
        "content-type": (method === "POST" ? "application/x-www-form-urlencoded" : "application/json"), // 默认值
        "TY-SID": wx.getStorageSync('sid'),
        'reqNo': new Date().getTime() + '_' + Math.random().toString(36).substr(2, 15),
      },
      success(res) {
        if (res.data.code == '0000') {
          resolve(res.data);
        } else if (res.data.code == '0030') {
          // sid过期
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                login(function (data) {
                  resolve(data)
                })
              }
            }
          })
        }else{
          reject(res.data);
          setTimeout(function () {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }, 100)
        }
      },
      fail(e) {
        reject({
          info: "网络请求失败"
        });
      },
      complete() {
        sideEffect.afterRequest(options);
      }
    });

    // 重新登录 
    function login(callBack) {
      wxService
        .getCode()
        .then(code => {
          wxService
            .getUserInfo()
            .then(res => {
              app.updateUserInfo(res.userInfo);//userInfo
              wx.request({
                url: BASE_URL + '/api/activity/user/wxMaLogin', //登录
                method: 'post',
                data: {
                  channelNo: app.globalData.channelNo,
                  jscode: code,
                  rawData: res.rawData,
                  signature: res.signature,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'reqNo': new Date().getTime() + '_' + Math.random().toString(36).substr(2, 15),
                },
                success: function (response) {
                  if (response.data.code == '0000'){
                    app.setLoginStatus(response.data.data.sid)
                    if (getCurrentPages()[getCurrentPages().length - 1].data.isLogin != undefined) {
                      getCurrentPages()[getCurrentPages().length - 1].setData({
                        isLogin: true
                      })
                    }
                    // 登录后重新请求接口
                    wx.request({
                      url: (options.url || BASE_URL) + api,
                      data: params,
                      method,
                      header: {
                        "content-type":
                          (method === "POST"
                            ? "application/x-www-form-urlencoded"
                            : "application/json"), // 默认值
                        "TY-SID": wx.getStorageSync('sid')
                      },
                      success(res) {
                        callBack(res.data)
                      }
                    })
                  } else{
                    wx.showToast({
                      title: response.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              })
            })
        })
    };
  });
}

export function get(api, params = {}, options = {}) {
  return request("GET", api, params, options);
}

export function post(api, params = {}, options = {}) {
  return request("POST", api, params, options);
}


export { BASE_URL }




/*
api 接口请求路径
params 数据
options  loadingMsg加载状态gif
type  自定义content-type
*/