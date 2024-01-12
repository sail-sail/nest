import type {
  LoginInput,
  LoginModel,
} from "/gen/types.ts";

/** 微信用户是否已绑定 */
export async function checkBindWxUsr(): Promise<boolean> {
  
  const {
    checkBindWxUsr,
  } = await import("./wx_usr.service.ts");
  
  return await checkBindWxUsr();
}

/** 微信用户绑定 */
export async function bindWxUsr(
  input: LoginInput,
): Promise<LoginModel> {
  
  const {
    bindWxUsr,
  } = await import("./wx_usr.service.ts");
  
  return await bindWxUsr(input);
}

/** 解除绑定 */
export async function unBindWxUsr() {
  const {
    unBindWxUsr,
  } = await import("./wx_usr.service.ts");
  
  return await unBindWxUsr();
}
