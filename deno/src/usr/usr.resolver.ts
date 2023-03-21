import {
  useContext,
} from "/lib/context.ts";

import * as usrService from "./usr.service.ts";

import {
  type MutationLoginArgs,
  type Mutation,
} from "/gen/types.ts"

/**
 * 登录获得 authorization
 * @param {MutationLoginArgs["username"]} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 * @param {MutationLoginArgs["dept_id"]} dept_id 部门id
 * @param {MutationLoginArgs["lang"]} lang 语言编码
 */
export async function login(
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
  dept_id: MutationLoginArgs["dept_id"],
  lang: MutationLoginArgs["lang"],
): Promise<Mutation["login"]> {
  const context = useContext();
  
  context.is_tran = true;
  return await usrService.login(username, password, tenant_id, dept_id, lang);
}

export async function getLoginInfo() {
  return await usrService.getLoginInfo();
}

export async function selectLang(lang: string) {
  return await usrService.selectLang(lang);
}
