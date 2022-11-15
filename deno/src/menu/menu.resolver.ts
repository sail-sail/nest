import * as menuService from "./menu.service.ts";

export async function getMenus(
  type: string,
) {
  return await menuService.getMenus(type);
}
