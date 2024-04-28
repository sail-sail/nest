import {
  findAll as findAllTenant,
  delCache as delCacheTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findAll as findAllDomain,
  delCache as delCacheDomain,
} from "/gen/base/domain/domain.dao.ts";

import type {
  SetTenantAdminPwdInput,
} from "/gen/types.ts";

import {
  findById as findByIdTenant,
  validateOption as validateOptionTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findOne as findOneUsr,
  create as createUsr,
  updateById as updateByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

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

/** 设置租户管理员密码 */
export async function setTenantAdminPwd(
  input: SetTenantAdminPwdInput,
): Promise<boolean> {
  const tenant_id = input.tenant_id;
  const pwd = input.pwd;
  await validateOptionTenant(
    await findByIdTenant(tenant_id),
  );
  const usr_model = await findOneUsr({
    username: "admin",
    tenant_id,
  });
  if (!usr_model) {
    await createUsr({
      username: "admin",
      password: pwd,
      tenant_id,
    });
  } else {
    await updateByIdUsr(
      usr_model.id,
      {
        password: pwd,
      },
    );
  }
  return true;
}
