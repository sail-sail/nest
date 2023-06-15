import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDao from "/src/base/usr/usr.dao.ts";

async function _getMenus(
  type?: string,
  parent_id?: string,
) {
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select
      t.id,
      t.type,
      t.parent_id,
      t.lbl,
      t.route_path,
      t.route_query
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
  if (type) {
    sql += ` and t.type = ${ args.push(type) }`;
  }
  const authModel = await authDao.getAuthModel();
  const tenant_id = await usrDao.getTenant_id(authModel?.id);
  if (tenant_id) {
    sql += ` and base_tenant_menu.tenant_id = ${ args.push(tenant_id) }`;
  }
  if (parent_id != null) {
    sql += ` and t.parent_id = ${ args.push(parent_id) }`;
  }
  if (authModel?.id) {
    sql += ` and base_usr_role.usr_id = ${ args.push(authModel.id) }`;
  }
  sql += ` order by t.order_by asc`;
  
  const table = "menu";
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  type Result = {
    id: string,
    type: string,
    parent_id: string,
    lbl: string,
    route_path: string,
    route_query?: string,
  };
  
  const result = await query<Result>(sql, args, { cacheKey1, cacheKey2 });
  
  return result;
}

export async function getMenus(
  type = "pc",
) {
  const allModels = await _getMenus(type);
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
