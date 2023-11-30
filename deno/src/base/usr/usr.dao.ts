import {
  useContext,
  query,
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

/**
 * 返回当前登录的用户
 * @param {string} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 */
export async function findLoginUsr(
  username: string,
  password: string,
  tenant_id: TenantId,
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.default_org_id
    from base_usr t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.username = ${ args.push(username) }
      and t.password = ${ args.push(password) }
      and t.tenant_id = ${ args.push(tenant_id) }
    limit 1
  `;
  const model = await queryOne<{
    id: UsrId,
    default_org_id: OrgId,
  }>(sql, args);
  return model;
}

export async function getOrgIdsById(
  id: UsrId,
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.org_id
    from
      base_usr_org t
    where
      t.is_deleted = 0
      and t.usr_id = ${ args.push(id) }
  `;
  const result = await query<{
    org_id: OrgId,
  }>(sql, args);
  return (result || [ ]).map((item) => item.org_id);
}

export async function getTenant_idByWx_usr(): Promise<TenantId | undefined> {
  const context = useContext();
  const notVerifyToken = context.notVerifyToken;
  const authModel = await authDao.getAuthModel(notVerifyToken);
  if (!authModel) {
    return;
  }
  const wx_usr_id = authModel.wx_usr_id;
  if (!wx_usr_id) {
    return;
  }
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.tenant_id
    from wx_wx_usr t
    where
      t.id = ${ args.push(wx_usr_id) }
    limit 1
  `;
  interface Result {
    id: string;
    tenant_id: TenantId;
  }
  const model = await queryOne<Result>(
    sql,
    args,
    {
      debug: false,
      logResult: false,
    },
  );
  const tenant_id = model?.tenant_id;
  return tenant_id;
}

/**
 * 根据用户id获取租户id
 * @return {Promise<TenantId>} 
 */
export async function getTenant_id(
  usr_id?: UsrId | null,
): Promise<TenantId | undefined> {
  const context = useContext();
  const notVerifyToken = context.notVerifyToken;
  const authModel = await authDao.getAuthModel(notVerifyToken);
  let tenant_id = authModel?.tenant_id;
  if (!tenant_id && usr_id) {
    const args = new QueryArgs();
    const sql = /*sql*/`
      select
        t.tenant_id
      from base_usr t
      where
        t.id = ${ args.push(usr_id) }
      limit 1
    `;
    interface Result {
      tenant_id?: TenantId;
    }
    const model = await queryOne<Result>(
      sql,
      args,
      {
        debug: false,
        logResult: false,
      },
    );
    tenant_id = model?.tenant_id;
  }
  if (!tenant_id) {
    tenant_id = await getTenant_idByWx_usr();
  }
  return tenant_id;
}
