import {
  query,
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import {
  type AuthModel,
} from "/lib/auth/auth.constants.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDao from "/src/base/usr/usr.dao.ts";

/**
 * 获取当前租户绑定的网址
 * @export getHostTenant
 * @return {{host: string}} 网址
 */
export async function getHostTenant(): Promise<typeof result> {
  const { id: usr_id } = await authDao.getAuthModel() as AuthModel;
  const tenant_id = await usrDao.getTenant_id(usr_id);
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      t.domain
    from base_tenant t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.id = ${ args.push(tenant_id) }
  `;
  interface Result {
    host: string,
  }
  const result = await queryOne<Result>(sql, args)
  return result;
}
