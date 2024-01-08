import * as menuDao from "./menu.dao.ts";

export async function getMenus() {
  return await menuDao.getMenus();
}
