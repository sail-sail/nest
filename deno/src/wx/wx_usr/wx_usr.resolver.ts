import type {
  LoginInput,
  LoginModel,
} from "/gen/types.ts";

/** 微信用户是否已绑定 */
export async function checkBind(): Promise<boolean> {
  
  const {
    checkBind,
  } = await import("./wx_usr.service.ts");
  
  return await checkBind();
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
