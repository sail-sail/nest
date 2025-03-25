import {
  log,
  error,
} from "/lib/context.ts";

import {
  getAccessToken,
} from "/src/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findByIdWxwApp,
  validateOptionWxwApp,
  validateIsEnabledWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  createWxwMsg,
} from "/gen/wxwork/wxw_msg/wxw_msg.dao.ts";

import type {
  WxwAppId,
} from "/gen/wxwork/wxw_app/wxw_app.model.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

export interface WxwCardMsg {
  wxw_app_id: WxwAppId;
  touser: string;
  title: string;
  description: string;
  url: string;
  btntxt: string;
}

/**
 * 发送卡片消息
 * @param input 
 */
export async function sendCardMsg(
  input: WxwCardMsg,
  force = false,
): Promise<boolean> {
  log(`发送卡片消息: ${ JSON.stringify(input) }`);
  const wxw_appModel = await validateOptionWxwApp(
    await findByIdWxwApp(input.wxw_app_id),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  const tenant_id: TenantId = wxw_appModel.tenant_id;
  const agentid = wxw_appModel.agentid;
  const access_token = await getAccessToken(
    input.wxw_app_id,
    force,
  );
  const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${
    access_token
  }`;
  if (!input.touser) {
    throw new Error(`touser 不能为空`);
  }
  if (!input.title) {
    throw new Error(`title 不能为空`);
  }
  if (!input.description) {
    throw new Error(`description 不能为空`);
  }
  const body = {
    touser: input.touser,
    msgtype: "textcard",
    agentid,
    textcard: {
      title: input.title,
      description: input.description,
      url: input.url,
      btntxt: input.btntxt,
    },
  };
  const res = await fetch(
    url,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  const data: {
    errcode: number;
    errmsg: string;
    msgid: string;
    response_code: string;
  } = await res.json();
  log(`发送卡片消息返回: ${ JSON.stringify(data) }`);
  const errcode = data.errcode;
  if (errcode == 42001 && !force) {
    return await sendCardMsg(
      input,
      true,
    );
  }
  let errmsg = data.errmsg.substring(0, 256);
  if (errcode == 0) {
    errmsg = "";
  }
  const msgid = data.msgid;
  await createWxwMsg({
    wxw_app_id: input.wxw_app_id,
    errcode: errcode.toString(),
    touser: input.touser,
    title: input.title,
    description: input.description,
    url: input.url,
    btntxt: input.btntxt,
    errmsg,
    msgid,
    tenant_id,
  });
  // 如果全部接收人无权限或不存在，则本次调用返回失败，errcode为81013
  if (errcode == 81013) {
    return false;
  }
  if (errcode != 0) {
    error(`发送卡片消息失败: ${ data.errmsg }`);
    let errmsg = data.errmsg;
    if (errcode === 60020) {
      errmsg = "外网IP地址未在企微白名单中, 请联系管理员";
    }
    throw errmsg;
  }
  return true;
}
