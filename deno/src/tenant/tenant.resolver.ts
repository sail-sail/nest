import * as tenantService from "./tenant.service.ts";

import {
  QueryGetLoginTenantsArgs,
} from "/gen/types.ts";

export async function getLoginTenants(
  host: QueryGetLoginTenantsArgs["host"],
) {
  const data = await tenantService.getLoginTenants(host);
  return data;
}
