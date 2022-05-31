import { Context } from "/lib/context.ts";
import { QueryArgs } from "/lib/query_args.ts";
import { AuthModel } from "/lib/auth/auth.constants.ts";
import { getAuthModel } from "/lib/auth/auth.dao.ts";
import { getTenant_id } from "/src/usr/usr.dao.ts";

/**
 * 获取当前租户绑定的网址
 * @export getHostTenant
 * @param {Context} context
 * @return {{host: string}} 网址
 */
export async function getHostTenant(
  context: Context,
): Promise<typeof result> {
  const { id: usr_id } = await getAuthModel(context) as AuthModel;
  const tenant_id = await getTenant_id(context, usr_id);
  const args = new QueryArgs();
  const sql = `
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
  const result = await context.queryOne<Result>(sql, args)
  return result;
}
