import { Context } from "/lib/context.ts";
import { Sort } from "/lib/page.model.ts";
import * as tenantDao from "/gen/tenant/tenant.dao.ts";
import { TenantSearch } from "/gen/tenant/tenant.model.ts";

export async function getLoginTenants(
  context: Context,
  host: string,
): Promise<{ id: string, lbl: string }[]> {
  const sort: Sort = {
    prop: "order_by",
    order: "asc",
  };
  const search: TenantSearch = { };
  if (window.process.env.NODE_ENV === "production") {
    search.host = host;
  }
  const models = await tenantDao.findAll(context, search, undefined, sort);
  return models.map((model) => ({
    id: model.id!,
    lbl: model.lbl!,
  }));
}
