import {
  useContext,
} from "/lib/context.ts";
 
import type {
  LoginInput,
  LoginModel,
  WxoLoginByCodeInput,
  WxoGetAppid,
} from "/gen/types.ts";

/** 通过域名获取开发者ID */
export async function wxoGetAppid(
  host: string,
): Promise<WxoGetAppid> {
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

/** 公众号用户是否已绑定 */
export async function checkBindWxoUsr(): Promise<boolean> {
  
  const {
    checkBindWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  return await checkBindWxoUsr();
}

/** 公众号用户绑定 */
export async function bindWxoUsr(
  input: LoginInput,
): Promise<LoginModel> {
  
  const {
    bindWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  return await bindWxoUsr(input);
}

/** 公众号用户解除绑定 */
export async function unBindWxoUsr() {
  const {
    unBindWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  return await unBindWxoUsr();
}

/** 获取公众号用户信息 */
export async function getWxoUsrInfo() {
  const {
    getWxoUsrInfo,
  } = await import("./wxo_usr.service.ts");
  
  return await getWxoUsrInfo();
}
