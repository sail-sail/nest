import { Context } from "/lib/context.ts";

import * as usrService from "./usr.service.ts";

import {
  MutationLoginArgs,
} from "/gen/types.ts"

/**
 * 登录获得 authorization
 * @param {Context} context
 * @param {MutationLoginArgs["username"]} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 */
export async function login(
  context: Context,
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
): Promise<string> {
  context.is_tran = true;
  return await usrService.login(context, username, password, tenant_id);
}
