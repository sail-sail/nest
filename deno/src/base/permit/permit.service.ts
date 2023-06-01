import { getAuthModel } from "/lib/auth/auth.dao.ts";

import * as permitDao from "/gen/base/permit/permit.dao.ts";
import * as usrDao from "/gen/base/usr/usr.dao.ts";
import * as menuDao from "/gen/base/menu/menu.dao.ts";

import {
  type GetUsrPermits,
} from "/gen/types.ts";

/**
 * 根据当前用户获取权限列表
 */
export async function getUsrPermits(): Promise<GetUsrPermits[]> {
  const authModel = await getAuthModel();
  const usr_id = authModel.id;
  const usrModel = await usrDao.findById(usr_id);
  if (!usrModel) {
    return [ ];
  }
  const role_ids = usrModel.role_ids;
  if (!role_ids || role_ids.length === 0) {
    return [ ];
  }
  const permitModels = await permitDao.findAll({
    role_id: role_ids,
  });
  const menu_idMap = new Map<string, string>();
  for (const permitModel of permitModels) {
    const menu_id = permitModel.menu_id;
    if (menu_idMap.has(menu_id)) {
      continue;
    }
    if (!menu_id) {
      menu_idMap.set(menu_id, "");
      continue;
    }
    const menuModel = await menuDao.findById(menu_id);
    if (!menuModel) {
      menu_idMap.set(menu_id, "");
      continue;
    }
    const route_path = menuModel.route_path;
    menu_idMap.set(menu_id, route_path);
  }
  const permits: GetUsrPermits[] = permitModels.map((permitModel) => {
    const menu_id = permitModel.menu_id;
    const route_path = menu_idMap.get(menu_id) || "";
    return {
      id: permitModel.id,
      menu_id,
      route_path,
      code: permitModel.code,
      lbl: permitModel.lbl,
      is_visible: !!permitModel.is_visible,
    };
  });
  return permits;
}
