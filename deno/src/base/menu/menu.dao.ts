import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import type {
  MenuId,
} from "/gen/base/menu/menu.model.ts";

async function _getMenus(
  parent_id?: MenuId,
) {
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select distinct
      t.id,
      t.parent_id,
      t.lbl,
      t.route_path,
      t.route_query,
      t.order_by
    from base_menu t
    inner join base_tenant_menu
      on t.id = base_tenant_menu.menu_id
      and base_tenant_menu.is_deleted = 0
    inner join base_tenant
      on base_tenant_menu.tenant_id = base_tenant.id
      and base_tenant.is_deleted = 0
      and base_tenant.is_enabled = 1
    inner join base_role_menu
      on t.id = base_role_menu.menu_id
      and base_role_menu.is_deleted = 0
    inner join base_usr_role
      on base_role_menu.role_id = base_usr_role.role_id
      and base_usr_role.is_deleted = 0
    where
      t.is_deleted = 0
      and t.is_enabled = 1
  `;
  const authModel = await getAuthModel();
  const tenant_id = await getTenant_id(authModel?.id);
  if (tenant_id) {
    sql += ` and base_tenant_menu.tenant_id = ${ args.push(tenant_id) }`;
  }
  if (parent_id != null) {
    sql += ` and t.parent_id = ${ args.push(parent_id) }`;
  }
  if (authModel?.id) {
    sql += ` and base_usr_role.usr_id = ${ args.push(authModel.id) }`;
  }
  
  const table = "base_menu";
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  type Result = {
    id: MenuId,
    parent_id: string,
    lbl: string,
    route_path: string,
    route_query?: string,
    order_by: number,
  };
  
  const result = await query<Result>(sql, args, { cacheKey1, cacheKey2 });
  
  result.sort((a, b) => a.order_by - b.order_by);
  
  return result;
}

export async function getMenus() {
  const allModels = await _getMenus();
  // let menus: typeof allModels = [ ];
  // // deno-lint-ignore no-explicit-any
  // async function tmpFn(parent?: any) {
  //   // let models = await t.menu2Dao.getMenus(parent && parent.id || "", type);
  //   let models = allModels.filter((item) => item.parent_id === (parent && parent.id || ""));
  //   if (!parent) {
  //     menus = models;
  //   } else {
  //     models = models.filter((item) => !menus.some((item2) => item.id === item2.id));
  //     parent.children = models;
  //   }
  //   for (let i = 0; i < models.length; i++) {
  //     const item = models[i];
  //     await tmpFn(item);
  //   }
  // }
  // await tmpFn();
  // return menus;
  return allModels;
}
