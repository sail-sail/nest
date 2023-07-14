import {
  useContext,
  query,
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  type MutationLoginArgs,
} from "/gen/types.ts";

/**
 * 返回当前登录的用户
 * @param {MutationLoginArgs["username"]} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 */
export async function findLoginUsr(
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.default_dept_id
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
    id: string,
    default_dept_id: string,
  }>(sql, args);
  return model;
}

export async function getDeptIdsById(
  id: string,
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.dept_id
    from
      base_usr_dept t
    where
      t.is_deleted = 0
      and t.usr_id = ${ args.push(id) }
  `;
  const result = await query<{
    dept_id: string,
  }>(sql, args);
  return (result || [ ]).map((item) => item.dept_id);
}

export async function getTenant_idByWx_usr() {
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
    tenant_id: string;
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
 * @return {Promise<string>} 
 */
export async function getTenant_id(
  usr_id?: string,
): Promise<string | undefined> {
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
      tenant_id?: string;
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
