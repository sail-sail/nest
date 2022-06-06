import { Global, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import config from "../config";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { WxappDao } from "./wxapp.dao";
import { AppDao } from "../app/app.dao";
import { AuthService } from "../auth/auth.service";

@Global()
@Injectable()
export class WxappService {
  
  constructor(
    private readonly httpService: HttpService,
    private readonly wxappDao: WxappDao,
    private readonly appDao: AppDao,
    private readonly authService: AuthService,
  ) { }
  
  async code2Session(
    code: string,
  ): Promise<string> {
    const t = this;
    if (!config.wxapp || !config.wxapp.appid || !config.wxapp.secret) {
      throw "wxapp in config.toml is null";
    }
    const axiosRes: AxiosResponse<{
      openid: string,
      session_key: string,
      unionid: string,
      errcode: number,
      errmsg: string,
    }> = await firstValueFrom(t.httpService.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid: config.wxapp.appid,
          secret: config.wxapp.secret,
          js_code: code,
          grant_type: "authorization_code",
        },
      },
    ));
    const data = axiosRes.data;
    if (data.errcode && data.errcode != 0) {
      throw `WxappService.code2Session: ${ JSON.stringify(data) }`;
    }
    let model = await t.wxappDao.findByOpenid(data.openid);
    const id = await t.appDao.generateId();
    if (!model || !model.id) {
      await t.wxappDao.create({
        id,
        openid: data.openid,
        lbl: data.openid,
        session_key: data.session_key,
        unionid: data.unionid,
      });
      model = { id, session_key: data.session_key, unionid: data.unionid };
    } else if (model.session_key !== data.session_key || model.unionid !== data.unionid ) {
      await t.wxappDao.updateSession_key({
        id: model.id,
        unionid: data.unionid,
        session_key: data.session_key,
      });
    }
    const { access_token } = await t.authService.createToken({ id: model.id });
    return access_token;
  }
  
}
