import type {
  WxwGetConfigSignature,
} from "/gen/types.ts";

import {
  getJsapiTicketSignature,
  getJsapiTicketAgentConfigSignature,
} from "./wxw_app_token.dao.ts";

import {
  findOneWxwApp,
  validateOptionWxwApp,
  validateIsEnabledWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

/** 通过 appid, agentid, url 生成企业签名 */
export async function wxwGetConfigSignature(
  appid: string,
  agentid: string,
  url: string,
): Promise<WxwGetConfigSignature> {
  
  const wx_app_model = await validateOptionWxwApp(
    await findOneWxwApp({
      corpid: appid,
      agentid: agentid,
    }),
  );
  await validateIsEnabledWxwApp(wx_app_model);
  
  const wx_app_id = wx_app_model.id;
  
  const res = await getJsapiTicketSignature(wx_app_id, url);
  
  return res;
}

/** 通过 appid, agentid, url 生成应用签名 */
export async function wxwGetAgentConfigSignature(
  appid: string,
  agentid: string,
  url: string,
): Promise<WxwGetConfigSignature> {
  
  const wx_app_model = await validateOptionWxwApp(
    await findOneWxwApp({
      corpid: appid,
      agentid: agentid,
    }),
  );
  await validateIsEnabledWxwApp(wx_app_model);
  
  const wx_app_id = wx_app_model.id;
  
  const res = await getJsapiTicketAgentConfigSignature(wx_app_id, url);
  
  return res;
}
