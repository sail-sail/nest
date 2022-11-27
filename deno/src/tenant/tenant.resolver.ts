import {
  _internals as tenantService,
} from "./tenant.service.ts";

import {
  type QueryGetLoginTenantsArgs,
} from "/gen/types.ts";

export const _internals = {
  getLoginTenants,
};

async function getLoginTenants(
  host: QueryGetLoginTenantsArgs["host"],
) {
  const data = await tenantService.getLoginTenants(host);
  return data;
}
