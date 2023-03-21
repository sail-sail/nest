import {
  type QueryGetLoginTenantsArgs,
} from "/gen/types.ts";

export async function getLoginTenants(
  host: QueryGetLoginTenantsArgs["host"],
) {
  const {
    getLoginTenants,
  } = await import("./tenant.service.ts");
  const data = await getLoginTenants(host);
  return data;
}
