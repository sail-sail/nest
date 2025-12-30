import type {
  MenuSearch,
  FindMenuAndRoles,
} from "/gen/types.ts";

export async function getMenus() {
  const {
    getMenus,
  } = await import("./menu.service.ts");
  
  return await getMenus();
}

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
): Promise<FindMenuAndRoles> {
  const {
    findMenuAndRoles,
  } = await import("./menu.service.ts");
  return await findMenuAndRoles(search);
}
