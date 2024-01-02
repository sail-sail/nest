import type {
  QueryGetLoginTenantsArgs,
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
