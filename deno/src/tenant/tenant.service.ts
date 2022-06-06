import { Context } from "/lib/context.ts";
import * as tenantDao from "/src/tenant/tenant.dao.ts";

export async function getLoginTenants(
  context: Context,
  host: string,
): Promise<{ id: string, lbl: string }[]> {
  const result = await tenantDao.getLoginTenants(context, host)
  return result;
}
