import {
  _internals as menuDao,
} from "./menu.dao.ts";

export const _internals = {
  getMenus,
};

async function getMenus(
  type: string,
) {
  return await menuDao.getMenus(type);
}
