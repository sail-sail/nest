import * as tenantDao from "/src/base/tenant/tenant.dao.ts";

export async function getLoginTenants(
  domain: string,
): Promise<{ id: string, lbl: string }[]> {
  const result = await tenantDao.getLoginTenants(domain);
  return result;
}
