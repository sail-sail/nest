import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path as route_path_menu,
} from "/gen/base/menu/menu.model.ts";

import {
  initN,
} from "/src/base/i18n/i18n.ts";

async function _getMenus(
  parent_id?: MenuId,
) {
  const args = new QueryArgs();
  let sql = `
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
      and base_tenant_menu.is_deleted=0
    inner join base_tenant
      on base_tenant_menu.tenant_id = base_tenant.id
      and base_tenant.is_deleted=0
      and base_tenant.is_enabled=1
    inner join base_role_menu
      on t.id = base_role_menu.menu_id
      and base_role_menu.is_deleted=0
    inner join base_usr_role
      on base_role_menu.role_id=base_usr_role.role_id
      and base_usr_role.is_deleted=0
    where
      t.is_deleted=0
      and t.is_enabled=1
  `;
  const usr_id = await get_usr_id();
  if (!usr_id) {
    return [ ];
  }
  const tenant_id = await getTenant_id(usr_id);
  if (tenant_id) {
    sql += ` and base_tenant_menu.tenant_id=${ args.push(tenant_id) }`;
  }
  if (parent_id != null) {
    sql += ` and t.parent_id=${ args.push(parent_id) }`;
  }
  const usr_model = await validateOptionUsr(
    await findByIdUsr(
      usr_id,
      {
        is_debug: false,
      },
    ),
  );
  const username = usr_model.username;
  if (username !== "admin") {
    sql += ` and base_usr_role.usr_id=${ args.push(usr_id) }`;
  }
  
  const table = "base_menu";
  
  const cacheKey1 = `dao.sql.${ table }._getMenus`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  type Result = {
    id: MenuId,
    parent_id: string,
    lbl: string,
    route_path: string,
    route_query: string,
    order_by: number,
  };
  
  let models = await query<Result>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  const {
    getEnv,
  } = await import("/lib/env.ts");
  
  const server_i18n_enable = await getEnv("server_i18n_enable");
  
  if (server_i18n_enable === "false") {
    models = models.filter((item) => item.route_path !== "/base/i18n" && item.route_path !== "/base/lang");
  } else {
    await initI18nMenus(models);
  }
  
  models.sort((a, b) => a.order_by - b.order_by);
  
  return models;
}

/** 菜单国际化 */
async function initI18nMenus(models: { lbl: string }[]) {
  const n = initN(route_path_menu);
  const set = new Set<string>();
  for (let i = 0; i < models.length; i++) {
    const item = models[i];
    set.add(item.lbl);
  }
  const arrPrms = new Array<Promise<string>>(set.size);
  let i = 0;
  for (const item of set) {
    arrPrms[i] = n(item);
    i++;
  }
  const arr = await Promise.all(arrPrms);
  const map = new Map<string, string>();
  i = 0;
  for (const item of set) {
    map.set(item, arr[i]);
    i++;
  }
  for (let i = 0; i < models.length; i++) {
    const item = models[i];
    item.lbl = map.get(item.lbl) || item.lbl;
  }
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
