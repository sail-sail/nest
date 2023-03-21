import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDao from "/src/usr/usr.dao.ts";

async function _getMenus(
  type?: string,
  menu_id?: string,
) {
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select
      t.id,
      t.type,
      t.menu_id,
      t.lbl,
      t.route_path
    from menu t
    inner join tenant_menu
      on t.id = tenant_menu.menu_id
      and tenant_menu.is_deleted = 0
    inner join tenant
      on tenant_menu.tenant_id = tenant.id
      and tenant.is_deleted = 0
      and tenant.is_enabled = 1
    inner join role_menu
      on t.id = role_menu.menu_id
      and role_menu.is_deleted = 0
    inner join usr_role
      on role_menu.role_id = usr_role.role_id
      and usr_role.is_deleted = 0
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
    sql += ` and tenant_menu.tenant_id = ${ args.push(tenant_id) }`;
  }
  if (menu_id) {
    sql += ` and t.menu_id = ${ args.push(menu_id) }`;
  }
  if (authModel?.id) {
    sql += ` and usr_role.usr_id = ${ args.push(authModel.id) }`;
  }
  sql += ` order by t.order_by asc`;
  
  const table = "menu";
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const result = await query<{
    id: string,
    type: string,
    menu_id: string,
    lbl: string,
    route_path: string,
  }>(sql, args, { cacheKey1, cacheKey2 });
  
  return result;
}

export async function getMenus(
  type = "pc",
) {
  const allModels = await _getMenus(type);
  let menus: typeof allModels = [ ];
  // deno-lint-ignore no-explicit-any
  async function tmpFn(parent?: any) {
    // let models = await t.menu2Dao.getMenus(parent && parent.id || "", type);
    let models = allModels.filter((item) => item.menu_id === (parent && parent.id || ""));
    if (!parent) {
      menus = models;
    } else {
      models = models.filter((item) => !menus.some((item2) => item.id === item2.id));
      parent.children = models;
    }
    for (let i = 0; i < models.length; i++) {
      const item = models[i];
      await tmpFn(item);
    }
  }
  await tmpFn();
  return menus;
}
