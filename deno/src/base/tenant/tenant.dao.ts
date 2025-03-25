import {
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import type {
  AuthModel,
} from "/lib/auth/auth.constants.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

/**
 * 获取当前租户绑定的网址
 * @export getHostTenant
 * @return {{host: string}} 网址
 */
export async function getHostTenant(): Promise<typeof result> {
  const authModel = await authDao.getAuthModel() as AuthModel;
  const usr_id: UsrId = authModel.id;
  const tenant_id = await getTenant_id(usr_id);
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      t.domain
    from base_tenant t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.id = ${ args.push(tenant_id) }
  `;
  interface Result {
    host: string,
  }
  const result = await queryOne<Result>(sql, args)
  return result;
}

/** 当前租户拥有的菜单 */
export async function getMenuIdsByTenant(): Promise<MenuId[]> {
  const {
    findByIdTenant,
  } = await import("/gen/base/tenant/tenant.dao.ts");
  let menu_idsInTenant: MenuId[] = [ ];
  const tenant_id = await getTenant_id();
  if (tenant_id) {
    const tenantModel = await findByIdTenant(tenant_id);
    menu_idsInTenant = tenantModel?.menu_ids || menu_idsInTenant;
  }
  return menu_idsInTenant;
}

export async function filterMenuIdsByTenant(
  menu_ids?: MenuId[] | null,
) {
  if (!menu_ids) {
    return menu_ids;
  }
  if (menu_ids.length === 0) {
    return [ ];
  }
  const menu_idsInTenant = await getMenuIdsByTenant();
  const menu_ids2: MenuId[] = [ ];
  for (let i = 0; i < menu_ids.length; i++) {
    const menu_id: MenuId = menu_ids[i];
    if (menu_idsInTenant.includes(menu_id)) {
      menu_ids2.push(menu_id);
    }
  }
  return menu_ids2;
}
