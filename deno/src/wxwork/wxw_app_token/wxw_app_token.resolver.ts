import type {
  WxwGetConfigSignature,
} from "/gen/types.ts";

/** 通过 appid, agentid, url 生成企业签名 */
export async function wxwGetConfigSignature(
  appid: string,
  agentid: string,
  url: string,
): Promise<WxwGetConfigSignature> {
  
  const {
    wxwGetConfigSignature,
  } = await import("./wxw_app_token.service.ts");
  
  const res = await wxwGetConfigSignature(appid, agentid, url);
  
  return res;
}

/** 通过 appid, agentid, url 生成应用签名 */
export async function wxwGetAgentConfigSignature(
  appid: string,
  agentid: string,
  url: string,
): Promise<WxwGetConfigSignature> {
  
  const {
    wxwGetAgentConfigSignature,
  } = await import("./wxw_app_token.service.ts");
  
  const res = await wxwGetAgentConfigSignature(appid, agentid, url);
  
  return res;
}
