import {
  type GetUsrPermits,
} from "/gen/types.ts";

/**
 * 根据当前用户获取权限列表
 */
export async function getUsrPermits(): Promise<GetUsrPermits[]> {
  const {
    getAuthModel,
  } = await import("/lib/auth/auth.dao.ts");
  
  const {
    findAll: findAllPermit,
  } = await import("/gen/base/permit/permit.dao.ts");
  
  const {
    findById: findByIdUsr,
  } = await import("/gen/base/usr/usr.dao.ts");
  
  const {
    findById: findByIdMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  const authModel = await getAuthModel();
  const usr_id = authModel.id;
  const usrModel = await findByIdUsr(usr_id);
  if (!usrModel) {
    return [ ];
  }
  const role_ids = usrModel.role_ids;
  if (!role_ids || role_ids.length === 0) {
    return [ ];
  }
  const permitModels = await findAllPermit({
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
    const menuModel = await findByIdMenu(menu_id);
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

/**
 * 查看当前用户是否有权限
 */
export async function usePermit(
  route_path: string,
  code: string,
): Promise<void> {
  const {
    ns,
  } = await import("/src/base/i18n/i18n.ts");
  
  const {
    getAuthModel,
  } = await import("/lib/auth/auth.dao.ts");
  
  const {
    findOne: findOnePermit,
  } = await import("/gen/base/permit/permit.dao.ts");
  
  const {
    findById: findByIdUsr,
  } = await import("/gen/base/usr/usr.dao.ts");
  
  const {
    findOne: findOneMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  const menuModel = await findOneMenu({
    route_path,
    is_enabled: [ 1 ],
  });
  if (!menuModel) {
    return;
  }
  const authModel = await getAuthModel();
  const usr_id = authModel.id;
  const usrModel = await findByIdUsr(usr_id);
  if (!usrModel) {
    return;
  }
  const role_ids = usrModel.role_ids;
  if (!role_ids || role_ids.length === 0) {
    return;
  }
  const permitModel = await findOnePermit({
    menu_id: [ menuModel.id ],
    role_id: role_ids,
    code,
  });
  if (!permitModel) {
    return;
  }
  if (permitModel.is_visible === 1) {
    return;
  }
  throw await ns("{0} {1} 无权限", permitModel.menu_id_lbl, permitModel.lbl);
}
