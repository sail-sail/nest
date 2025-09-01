import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import {
  get_lang_id,
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

async function _getMenus(
  parent_id?: MenuId,
) {
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
  const args = new QueryArgs();
  let lang_join = "";
  let lang_select = "";
  
  if (server_i18n_enable) {
    const lang_id = await get_lang_id();
    if (lang_id) {
      lang_join = `
        left join base_menu_lang
          on t.id=base_menu_lang.menu_id
          and base_menu_lang.lang_id=${ args.push(lang_id) }
      `;
      lang_select = "base_menu_lang.lbl as lbl_lang,";
    }
  }
  
  let sql = `
    select distinct
      t.id,
      t.parent_id,
      t.lbl,
      t.route_path,
      t.route_query,
      ${ lang_select }
      t.order_by
    from base_menu t
    inner join base_tenant_menu
      on t.id=base_tenant_menu.menu_id
      and base_tenant_menu.is_deleted=0
    inner join base_tenant
      on base_tenant_menu.tenant_id=base_tenant.id
      and base_tenant.is_deleted=0
      and base_tenant.is_enabled=1
    inner join base_role_menu
      on t.id=base_role_menu.menu_id
      and base_role_menu.is_deleted=0
    inner join base_usr_role
      on base_role_menu.role_id=base_usr_role.role_id
      and base_usr_role.is_deleted=0
    ${ lang_join }
    where
      t.is_deleted=0
      and t.is_enabled=1
      and t.is_hidden=0
      and t.is_home_hide=0
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
    lbl_lang: string,
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
  
  if (!server_i18n_enable) {
    models = models.filter((item) => item.route_path !== "/base/i18n" && item.route_path !== "/base/lang");
  } else {
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (model.lbl_lang) {
        model.lbl = model.lbl_lang;
      }
    }
  }
  
  models.sort((a, b) => a.order_by - b.order_by);
  
  return models;
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
