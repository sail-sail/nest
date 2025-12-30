import * as menuDao from "./menu.dao.ts";

import {
  findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

import {
  findAllRole,
} from "/gen/base/role/role.dao.ts";

import type {
  MenuSearch,
  FindMenuAndRoles,
} from "/gen/types.ts";

export async function getMenus() {
  return await menuDao.getMenus();
}

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
): Promise<FindMenuAndRoles> {
  // 1. 根据搜索条件查询菜单
  const menu_model = await findOneMenu(search);
  
  // 2. 查询拥有此菜单权限的角色列表
  const role_models = menu_model
    ? await findAllRole({
        menu_ids: [menu_model.id],
      })
    : [];
  
  // 3. 返回组合结果
  return {
    menu_model,
    role_models,
  };
}
