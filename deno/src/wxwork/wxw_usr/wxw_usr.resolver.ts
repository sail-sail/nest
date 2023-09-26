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
