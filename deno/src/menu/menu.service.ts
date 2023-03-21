import * as menuDao from "./menu.dao.ts";

export async function getMenus(
  type: string,
) {
  return await menuDao.getMenus(type);
}
