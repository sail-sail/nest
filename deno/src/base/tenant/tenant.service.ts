import {
  findAllTenant,
  delCacheTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findAllDomain,
  delCacheDomain,
} from "/gen/base/domain/domain.dao.ts";

import type {
  GetLoginTenants,
  SetTenantAdminPwdInput,
} from "/gen/types.ts";

import {
  findByIdsTenant,
  findByIdTenant,
  validateOptionTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findByIdLang,
} from "/gen/base/lang/lang.dao.ts";

import {
  findOneUsr,
  createUsr,
  updateByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

export async function getLoginTenants(
  domain: string,
): Promise<GetLoginTenants[]> {
  let domain_models = await findAllDomain({
    lbl: domain,
    is_enabled: [ 1 ],
  });
  if (domain_models.length === 0) {
    await delCacheDomain();
    domain_models = await findAllDomain({
      lbl: domain,
      is_enabled: [ 1 ],
    });
  }
  const res: GetLoginTenants[] = [ ];
  if (domain_models.length > 0) {
    let domain_ids: DomainId[] = domain_models.map((item) => item.id);
    let tenant_models = await findAllTenant({
      domain_ids,
      is_enabled: [ 1 ],
    });
    if (tenant_models.length === 0) {
      await delCacheDomain();
      domain_models = await findAllDomain({
        lbl: domain,
        is_enabled: [ 1 ],
      });
      domain_ids = domain_models.map((item) => item.id);
      await delCacheTenant();
      tenant_models = await findAllTenant({
        domain_ids,
        is_enabled: [ 1 ],
      });
    }
    for (const tenant_model of tenant_models) {
      const lang_id = tenant_model.lang_id;
      const lang_model = await findByIdLang(lang_id);
      const lang = lang_model?.code || "zh-CN";
      res.push({
        id: tenant_model.id,
        lbl: tenant_model.lbl,
        title: tenant_model.title,
        info: tenant_model.info,
        lang,
      });
    }
  }
  return res;
}

/** 根据 租户ids 获取 租户信息 */
export async function getLoginTenantByIds(
  tenant_ids: TenantId[],
): Promise<GetLoginTenants[]> {
  const tenant_models = await findByIdsTenant(tenant_ids);
  const res: GetLoginTenants[] = [ ];
  for (const tenant_model of tenant_models) {
    const lang_id = tenant_model.lang_id;
    const lang_model = await findByIdLang(lang_id);
    const lang = lang_model?.code || "zh-CN";
    res.push({
      id: tenant_model.id,
      lbl: tenant_model.lbl,
      title: tenant_model.title,
      info: tenant_model.info,
      lang,
    });
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
