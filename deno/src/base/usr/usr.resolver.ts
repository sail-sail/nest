import {
  useContext,
} from "/lib/context.ts";

import type {
  MutationLoginArgs,
  Mutation,
  ChangePasswordInput,
} from "/gen/types.ts"

/**
 * 登录获得 authorization
 * @param {MutationLoginArgs["input"]} input 登录信息
 *  username 用户名
 *  password 密码,传递进来的密码已经被前端md5加密过一次
 *  tenant_id 租户id
 *  org_id 组织id
 *  lang 语言编码
 */
export async function login(
  input: MutationLoginArgs["input"],
): Promise<Mutation["login"]> {
  const {
    login,
  } = await import("./usr.service.ts");
  const context = useContext();
  
  context.notVerifyToken = true;
  context.is_tran = true;
  return await login(input);
}

export async function getLoginInfo() {
  const {
    getLoginInfo,
  } = await import("./usr.service.ts");
  return await getLoginInfo();
}

export async function selectLang(lang: string) {
  const {
    selectLang,
  } = await import("./usr.service.ts");
  return await selectLang(lang);
}

// 修改密码
export async function changePassword(
  input: ChangePasswordInput,
) {
  const {
    changePassword,
  } = await import("./usr.service.ts");
  return await changePassword(input);
}
