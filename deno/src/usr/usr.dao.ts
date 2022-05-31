import { MutationLoginArgs } from "/gen/types.ts";
import { Context } from "/lib/context.ts";
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
  const sql = `
    select
      t.id
    from usr t
    where
      t.username = ${ args.push(username) }
      and t.password = ${ args.push(password) }
      and t.tenant_id = ${ args.push(tenant_id) }
  `;
  type Result = {
    id: string,
  }
  const result = await context.queryOne<Result>(sql, args);
  return result;
}

/**
 * 根据用户id获取租户id
 * @return {Promise<string>} 
 */
export async function getTenant_id(
  context: Context,
  usr_id: string,
): Promise<string | undefined> {
  const args = new QueryArgs();
  const sql = `
    select
      t.tenant_id
    from usr t
    where
      t.id = ${ args.push(usr_id) }
    limit 1
  `;
  const table = "usr";
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args, key: cacheKey1 });
  
  interface Result {
    tenant_id?: string;
  }
  const model = await context.queryOne<Result>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: false,
      logResult: false,
    },
  );
  const tenant_id = model?.tenant_id;
  return tenant_id;
}
