import {
  _internals as menuService,
} from "./menu.service.ts";

export const _internals = {
  getMenus,
};

async function getMenus(
  type: string,
) {
  return await menuService.getMenus(type);
}
