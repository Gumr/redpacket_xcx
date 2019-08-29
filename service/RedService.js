import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class RedService extends BaseService {
	// 获取红包 redPacketType 1 新人 2 天天
  getRedPacket(params) {
    return get("/api/activity/redPacket/list",
      params,
    ).then(this.handleRespond);
  }
  // 领取红包 redPacketId
  openRedPacket(params) {
    return post("/api/activity/redPacket/receive",
      params,
    ).then(this.handleRespond);
  }
  // 获取二维码 channel activityType
  getUserShareMsg(params) {
    return post("/api/activity/user/invite/share",
      params,
    ).then(this.handleRespond);
  }
  // 用户提现(红包余额)
  withdraw(params) {
    return post("/api/activity/user/withdraw",
      params,
    ).then(this.handleRespond);
  }
  // 获取提现金额 列表
  getWithdrawAmount(params) {
    return get("/api/activity/user/withdraw/rt/list",
      params,
    ).then(this.handleRespond);
  }
  // 获取用户信息
  info(params) {
    return get("/api/activity/user/info",
      params,
    ).then(this.handleRespond);
  }
  // 获取当前红包活动的金额
  getUserBalance(params) {
    return get("/api/activity/user/balance",
      params,
    ).then(this.handleRespond);
  }
  // 获取排行榜
  getShareLeaderboard(params) {
    return get("/api/activity/share/rank/list",
      params,
    ).then(this.handleRespond);
  }
  // 获取礼品列表
  giftinfo(params) {
    return get("/api/activity/gift/info",
      params,
    ).then(this.handleRespond);
  }

  // 打开礼品
  open(params) {
    return post("/api/activity/gift/open",
      params,
    ).then(this.handleRespond);
  }

  // 获取用户礼品分页列表
  giftpage(params) {
    return get("/api/activity/user/gift/page",
      params,
    ).then(this.handleRespond);
  }

  // 更新礼品地址
  address(params) {
    return post("/api/activity/user/gift/update/address",
      params,
    ).then(this.handleRespond);
  }

  // 获取邀请分页列表
  invite(params) {
    return get("/api/activity/user/invite/page",
      params,
    ).then(this.handleRespond);
  }

  // 获取广告列表 1001=活动首页轮播，1002=活动首页福利，1003=活动我的福利推荐 
  //0=不跳转，1=外链，2=小程序内链，3=跳转小程序，4=小程序客服(url为key)
  adv(params) {
    return get("/api/activity/adv/list",
      params,
    ).then(this.handleRespond);
  }

  // 提交formId formId
  submit(params) {
    return post("/api/activity/user/formId/submit",
      params,
    ).then(this.handleRespond);
  }

  // 获取活动中奖公告列表
  notice(params) {
    return get("/api/activity/prize/notice/list",
      params,
    ).then(this.handleRespond);
  }
}
