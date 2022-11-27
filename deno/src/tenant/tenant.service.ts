import {
  _internals as tenantDao,
} from "/src/tenant/tenant.dao.ts";

export const _internals = {
  getLoginTenants,
};

async function getLoginTenants(
  host: string,
): Promise<{ id: string, lbl: string }[]> {
  const result = await tenantDao.getLoginTenants(host);
  return result;
}
