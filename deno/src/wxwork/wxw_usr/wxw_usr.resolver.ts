import {
  useContext,
} from "/lib/context.ts";

import type {
  WxwLoginByCodeInput,
} from "/gen/types.ts";

/**
 * 企业微信单点登录
 */
export async function wxwLoginByCode(
  input: WxwLoginByCodeInput,
) {
  const {
    wxwLoginByCode,
  } = await import("./wxw_usr.service.ts");
  const context = useContext();
  
  context.notVerifyToken = true;
  context.is_tran = true;
  const res = await wxwLoginByCode(input);
  return res;
}

/**
 * 企业微信同步企微用户
 */
export async function wxwSyncUsr(
  host: string,
) {
  const {
    wxwSyncUsr,
  } = await import("./wxw_usr.service.ts");
  const res = await wxwSyncUsr(host);
  return res;
}
