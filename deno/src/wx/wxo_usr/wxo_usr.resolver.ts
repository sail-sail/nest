import {
  useContext,
} from "/lib/context.ts";
 
import type {
  WxoLoginByCodeInput,
} from "/gen/types.ts";

/** 通过域名获取开发者ID */
export async function wxoGetAppid(
  host: string,
) {
  const {
    wxoGetAppid,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.notVerifyToken = true;
  
  return await wxoGetAppid(host);
}

/**
 * 微信公众号单点登录
 */
export async function wxoLoginByCode(
  input: WxoLoginByCodeInput,
) {
  const {
    wxoLoginByCode,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.notVerifyToken = true;
  const res = await wxoLoginByCode(input);
  return res;
}
