import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class LoginService extends BaseService {
	// 登录
  login(params) {
    return post("/api/activity/user/wxMaLogin",
      params,
    ).then(this.handleRespond);
  }
  // 绑定手机号 encryptedData iv
  wxMaBindPhone(params) {
    return post("/api/activity/user/wxMaBindPhone",
      params,
    ).then(this.handleRespond);
  }
}
