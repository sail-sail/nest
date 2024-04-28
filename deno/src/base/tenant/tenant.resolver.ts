import type {
  QueryGetLoginTenantsArgs,
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
