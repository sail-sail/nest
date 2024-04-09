import {
  findAll as findAllTenant,
  delCache as delCacheTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findAll as findAllDomain,
  delCache as delCacheDomain,
} from "/gen/base/domain/domain.dao.ts";

export async function getLoginTenants(
  domain: string,
): Promise<{ id: TenantId, lbl: string }[]> {
  let domainModels = await findAllDomain({
    lbl: domain,
    is_enabled: [ 1 ],
  });
  if (domainModels.length === 0) {
    await delCacheDomain();
    domainModels = await findAllDomain({
      lbl: domain,
      is_enabled: [ 1 ],
    });
  }
  let res: { id: TenantId, lbl: string }[] = [ ];
  if (domainModels.length > 0) {
    const domain_ids: DomainId[] = domainModels.map((item) => item.id);
    let tenantModels = await findAllTenant({
      domain_ids,
      is_enabled: [ 1 ],
    });
    if (tenantModels.length === 0) {
      await delCacheTenant();
      tenantModels = await findAllTenant({
        domain_ids,
        is_enabled: [ 1 ],
      });
    }
    res = tenantModels.map((item) => ({
      id: item.id,
      lbl: item.lbl,
    }));
  }
  return res;
}
