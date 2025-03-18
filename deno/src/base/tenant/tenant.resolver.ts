import type {
  QueryGetLoginTenantsArgs,
  QueryGetLoginTenantByIdsArgs,
  SetTenantAdminPwdInput,
} from "/gen/types.ts";

export async function getLoginTenants(
  domain: QueryGetLoginTenantsArgs["domain"],
) {
  const {
    getLoginTenants,
  } = await import("./tenant.service.ts");
  
  const data = await getLoginTenants(domain);
  
  return data;
}

/** 根据 租户ids 获取 租户信息 */
export async function getLoginTenantByIds(
  tenant_ids: QueryGetLoginTenantByIdsArgs["tenant_ids"],
) {
  const {
    getLoginTenantByIds,
  } = await import("./tenant.service.ts");
  
  const data = await getLoginTenantByIds(tenant_ids);
  
  return data;
}

/** 设置租户管理员密码 */
export async function setTenantAdminPwd(
  input: SetTenantAdminPwdInput,
) {
  const {
    setTenantAdminPwd,
  } = await import("./tenant.service.ts");
  
  const data = await setTenantAdminPwd(input);
  
  return data;
}
