import { Context } from "/lib/context.ts";
import * as tenantService from "./tenant.service.ts";

import {
  QueryGetLoginTenantsArgs,
} from "/gen/types.ts";

export async function getLoginTenants(
  context: Context,
  host: QueryGetLoginTenantsArgs["host"],
) {
  const data = await tenantService.getLoginTenants(context, host);
  return data;
}
