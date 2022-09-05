import { Context } from "/lib/context.ts";
import { isEmpty } from "/lib/util/string_util.ts";
import * as authService from "/lib/auth/auth.service.ts";
import * as usrDao from "./usr.dao.ts";
import { MutationLoginArgs } from "/gen/types.ts";

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
  if (isEmpty(username) || isEmpty(password)) {
    throw "用户名或密码不能为空!";
  }
  if (isEmpty(tenant_id)) {
    throw "请选择租户!";
  }
  const password2 = await authService.getPassword(password);
  const model = await usrDao.findLoginUsr(context, username, password2, tenant_id);
  if (!model || !model.id) {
    throw "用户名或密码错误!";
  }
  const { authorization } = await authService.createToken({ id: model.id });
  return authorization;
}
