import { MutationLoginArgs } from "/gen/types.ts";
import { Context } from "/lib/context.ts";
import { getAuthModel } from "/lib/auth/auth.dao.ts";
import { QueryArgs } from "/lib/query_args.ts";

/**
 * 返回当前登录的用户
 * @param {Context} context
 * @param {MutationLoginArgs["username"]} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 */
export async function findLoginUsr(
  context: Context,
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.default_dept_id
    from usr t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.username = ${ args.push(username) }
      and t.password = ${ args.push(password) }
      and t.tenant_id = ${ args.push(tenant_id) }
    limit 1 
  `;
  const result = await context.queryOne<{
    id: string,
    default_dept_id: string,
  }>(sql, args);
  return result;
}

export async function getDept_idsById(
  context: Context,
  id: string,
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.dept_id
    from
      usr_dept t
    where
      t.is_deleted = 0
      and t.usr_id = ${ args.push(id) }
  `;
  const result = await context.query<{
    dept_id: string,
  }>(sql, args);
  return (result || [ ]).map((item) => item.dept_id);
}

async function getTenant_idByWx_usr(
  context: Context,
) {
  const notVerifyToken = context.notVerifyToken;
  const authModel = await getAuthModel(context, notVerifyToken);
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
      t.tenant_id
    from wx_usr t
    where
      t.id = ${ args.push(wx_usr_id) }
    limit 1
  `;
  interface Result {
    tenant_id?: string;
  }
  const model = await context.queryOne<Result>(
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
  context: Context,
  usr_id?: string,
): Promise<string | undefined> {
  const notVerifyToken = context.notVerifyToken;
  if (!usr_id) {
    const authModel = await getAuthModel(context, notVerifyToken);
    if (!authModel) {
      return;
    }
    usr_id = authModel.id;
  }
  let tenant_id: string | undefined;
  if (usr_id) {
    tenant_id = context.cacheMap.get("usr_tenant_id_" + usr_id);
    if (tenant_id) {
      return tenant_id;
    }
    const args = new QueryArgs();
    const sql = /*sql*/`
      select
        t.tenant_id
      from usr t
      where
        t.id = ${ args.push(usr_id) }
      limit 1
    `;
    interface Result {
      tenant_id?: string;
    }
    const model = await context.queryOne<Result>(
      sql,
      args,
      {
        debug: false,
        logResult: false,
      },
    );
    tenant_id = model?.tenant_id;
    if (tenant_id) {
      context.cacheMap.set("usr_tenant_id_" + usr_id, tenant_id);
    }
  }
  if (!tenant_id) {
    tenant_id = await getTenant_idByWx_usr(context);
  }
  return tenant_id;
}
