import type {
  LoginInput,
  LoginModel,
} from "/gen/types.ts";

export async function bindWxUsr(
  input: LoginInput,
): Promise<LoginModel> {
  
  const {
    bindWxUsr,
  } = await import("./wx_usr.service.ts");
  
  return await bindWxUsr(input);
}
