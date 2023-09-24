import {
  error,
} from "/lib/context.ts";
 
import {
  isEmpty,
  shortUuidV4,
} from "/lib/util/string_util.ts";
 
import dayjs from "dayjs";

import {
  findOne as findOneWxwAppToken,
  create as createWxwAppToken,
  updateById as updateByIdWxwAppToken,
} from "/gen/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

export async function getAccessToken(
  corpid: string,
  force = false,
) {
  const wx_appModel = await findOneWxwApp({
    corpid,
  });
  if (!wx_appModel) {
    throw `未设置企业微信应用, corpid: ${ corpid }`;
  }
  const wxw_app_id = wx_appModel.id;
  const corpsecret = wx_appModel.corpsecret;
  if (isEmpty(corpsecret)) {
    throw `未设置企业微信应用 corpsecret, corpid: ${ corpid }`;
  }
  const dateNow = dayjs();
  const wx_app_tokenModel = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
    },
  );
  if (!wx_app_tokenModel) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${ corpid }&corpsecret=${ corpsecret }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    const access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    const id = shortUuidV4();
    await createWxwAppToken(
      {
        id,
        wxw_app_id,
        access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
    return access_token;
  }
  let access_token = wx_app_tokenModel.access_token;
  const expires_in = wx_app_tokenModel.expires_in ?? 0;
  const token_time = dayjs(wx_app_tokenModel.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !wx_app_tokenModel.token_time
    // || !token_time.isValid()
    || token_time.add(2, "m").isBefore(dateNow)
  ) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${ corpid }&corpsecret=${ corpsecret }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    await updateByIdWxwAppToken(
      wx_appModel.id,
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
  }
  return access_token;
}
