import {
  query,
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import {
  type AuthModel,
} from "/lib/auth/auth.constants.ts";

import {
  _internals as authDao,
} from "/lib/auth/auth.dao.ts";

import {
  _internals as usrDao,
} from "/src/usr/usr.dao.ts";

export const _internals = {
  getHostTenant,
  getLoginTenants,
};

/**
 * 获取当前租户绑定的网址
 * @export getHostTenant
 * @return {{host: string}} 网址
 */
async function getHostTenant(): Promise<typeof result> {
  const { id: usr_id } = await authDao.getAuthModel() as AuthModel;
  const tenant_id = await usrDao.getTenant_id(usr_id);
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      t.host
    from tenant t
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

async function getLoginTenants(
  _host: string,
): Promise<typeof result> {
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      t.id,
      t.lbl
    from tenant t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
  `;
  // if (window.process.env.NODE_ENV === "production") {
  //   sql += ` and t.host = ${ args.push(host) }`;
  // }
  interface Result {
    id: string,
    lbl: string,
  }
  const result = await query<Result>(sql, args)
  return result;
}
