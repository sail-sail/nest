import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import * as domainDao from "/gen/base/domain/domain.dao.ts";

export async function getLoginTenants(
  domain: string,
): Promise<{ id: string, lbl: string }[]> {
  const domainModels = await domainDao.findAll({
    lbl: domain,
    is_enabled: [ 1 ],
  });
  let res: { id: string, lbl: string }[] = [ ];
  if (domainModels.length > 0) {
    const domain_ids = domainModels.map((item) => item.id);
    const tenantModels = await tenantDao.findAll({
      domain_ids,
      is_enabled: [ 1 ],
    });
    res = tenantModels.map((item) => ({
      id: item.id,
      lbl: item.lbl,
    }));
  }
  return res;
}
