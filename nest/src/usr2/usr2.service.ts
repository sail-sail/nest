import { Injectable } from "@nestjs/common";
// import { OnEvent } from "@nestjs/event-emitter";
import { AuthService } from "../common/auth/auth.service";
import { isEmpty } from "../common/util/StringUitl";
import { Usr2Dao } from "./usr2.dao";

@Injectable()
export class Usr2Service {
  
  constructor(
    private readonly authService: AuthService,
    private readonly usr2Dao: Usr2Dao,
  ) { }
  
  /**
   * 根据用户名密码登录
   * @param {string} username 用户名
   * @param {string} password 密码,传递进来的密码已经被前端md5加密过一次
   * @param {string} tenant_id 租户id
   * @return {Promise<string>} 返回token
   * @memberof Usr2Service
   */
  async login(
    username: string,
    password: string,
    tenant_id: string,
  ): Promise<string> {
    const t = this;
    if (isEmpty(username) || isEmpty(password)) {
      throw "用户名或密码不能为空!";
    }
    password = t.authService.getPassword(password);
    const model = await t.usr2Dao.findLoginUsr(username, password, tenant_id);
    if (!model || !model.id) {
      throw "用户名或密码错误!";
    }
    const { access_token } = await t.authService.createToken({ id: model.id });
    return access_token;
  }
  
  // @OnEvent('usr.updateById.before', { promisify: true })
  // async onUsrCreateAftEvt(event: { id: string }) {
  // }
  
}
