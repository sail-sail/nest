import type {
  WxwLoginByCodeInput,
} from "/gen/types.ts";

import {
  getuserinfoByCode,
  getuser,
} from "/src/wxwork/wxw_app_token/wxw_app_token.dao.ts";

/**
 * 企业微信单点登录
 */
export async function wxwLoginByCode(
  input: WxwLoginByCodeInput,
) {
  const corpid = input.corpid;
  const agentid = input.agentid;
  const code = input.code;
  const { userid } = await getuserinfoByCode(corpid, code);
  const { name } = await getuser(corpid, userid);
  console.log("wxwLoginByCode", userid, name);
}
