import { Context } from "/lib/context.ts";
import * as menuService from "./menu.service.ts";

export async function getMenus(
  context: Context,
  type: string,
) {
  return await menuService.getMenus(context, type);
}
