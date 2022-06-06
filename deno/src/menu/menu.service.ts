import { Context } from "/lib/context.ts";
import * as menuDao from "./menu.dao.ts";

export async function getMenus(
  context: Context,
  type: string,
) {
  return await menuDao.getMenus(context, type);
}
