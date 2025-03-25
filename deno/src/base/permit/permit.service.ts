import type {
  PermitModel,
  GetUsrPermits,
} from "/gen/types.ts";

/**
 * 根据当前用户获取权限列表
 */
export async function getUsrPermits(): Promise<GetUsrPermits[]> {
  const {
    getAuthModel,
  } = await import("/lib/auth/auth.dao.ts");
  
  const {
    findAllPermit,
  } = await import("/gen/base/permit/permit.dao.ts");
  
  const {
    findByIdUsr,
  } = await import("/gen/base/usr/usr.dao.ts");
  
  const {
    findByIdMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  const {
    findAllRole,
  } = await import("/gen/base/role/role.dao.ts");
  
  const authModel = await getAuthModel(false);
  if (!authModel) {
    return [ ];
  }
  
  const options = {
    is_debug: false,
  };
  
  const usr_id = authModel.id;
  const usrModel = await findByIdUsr(usr_id, options);
  if (!usrModel) {
    return [ ];
  }
  const role_ids = usrModel.role_ids;
  if (!role_ids || role_ids.length === 0) {
    return [ ];
  }
  const roleModels = await findAllRole(
    {
      ids: role_ids,
    },
    undefined,
    undefined,
    options,
  );
  const permit_ids: PermitId[] = [ ];
  for (const roleModel of roleModels) {
    const permit_ids2 = roleModel.permit_ids;
    if (!permit_ids2 || permit_ids2.length === 0) {
      continue;
    }
    for (const permit_id of permit_ids2) {
      if (permit_ids.includes(permit_id as PermitId)) {
        continue;
      }
      permit_ids.push(permit_id as PermitId);
    }
  }
  // 切分成多个批次查询
  const permit_idsArr: PermitId[][] = [ ];
  const batch_size = 100;
  const batch_count = Math.ceil(permit_ids.length / batch_size);
  for (let i = 0; i < batch_count; i++) {
    permit_idsArr.push(permit_ids.slice(i * batch_size, (i + 1) * batch_size));
  }
  const permitModels: PermitModel[] = [ ];
  for (const permit_ids of permit_idsArr) {
    const permitModels0 = await findAllPermit(
      {
        ids: permit_ids,
      },
      undefined,
      undefined,
      options,
    );
    permitModels.push(...permitModels0);
  }
  const menu_idMap = new Map<MenuId, string>();
  for (const permitModel of permitModels) {
    const menu_id: MenuId = permitModel.menu_id;
    if (menu_idMap.has(menu_id)) {
      continue;
    }
    if (!menu_id) {
      menu_idMap.set(menu_id, "");
      continue;
    }
    const menuModel = await findByIdMenu(menu_id, options);
    if (!menuModel) {
      menu_idMap.set(menu_id, "");
      continue;
    }
    const route_path = menuModel.route_path;
    menu_idMap.set(menu_id, route_path);
  }
  const permits: GetUsrPermits[] = permitModels.map((permitModel) => {
    const menu_id: MenuId = permitModel.menu_id;
    const route_path = menu_idMap.get(menu_id) || "";
    return {
      id: permitModel.id as PermitId,
      menu_id,
      route_path,
      code: permitModel.code,
      lbl: permitModel.lbl,
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
    findOnePermit,
  } = await import("/gen/base/permit/permit.dao.ts");
  
  const {
    findByIdUsr,
  } = await import("/gen/base/usr/usr.dao.ts");
  
  const {
    findAllRole,
  } = await import("/gen/base/role/role.dao.ts");
  
  const {
    findOneMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  const options = {
    is_debug: false,
  };
  
  const menuModel = await findOneMenu(
    {
      route_path,
      is_enabled: [ 1 ],
    },
    undefined,
    options,
  );
  if (!menuModel) {
    return;
  }
  
  const authModel = await getAuthModel(false);
  
  if (!authModel) {
    throw await ns("无权限");
  }
  const usr_id: UsrId = authModel.id;
  const usrModel = await findByIdUsr(usr_id, options);
  if (!usrModel) {
    throw await ns("无权限");
  }
  if (usrModel.username === "admin") {
    return;
  }
  const role_ids = usrModel.role_ids;
  if (!role_ids || role_ids.length === 0) {
    throw await ns("无权限");
  }
  const roleModels = await findAllRole(
    {
      ids: role_ids,
    },
    undefined,
    undefined,
    options,
  );
  const permit_ids: PermitId[] = [ ];
  for (const roleModel of roleModels) {
    const permit_ids2 = roleModel.permit_ids;
    if (!permit_ids2 || permit_ids2.length === 0) {
      continue;
    }
    for (const permit_id of permit_ids2) {
      if (permit_ids.includes(permit_id)) {
        continue;
      }
      permit_ids.push(permit_id);
    }
  }
  // 切分成多个批次查询
  const permit_idsArr: PermitId[][] = [ ];
  const batch_size = 100;
  const batch_count = Math.ceil(permit_ids.length / batch_size);
  for (let i = 0; i < batch_count; i++) {
    permit_idsArr.push(permit_ids.slice(i * batch_size, (i + 1) * batch_size));
  }
  for (const permit_ids of permit_idsArr) {
    const permitModel = await findOnePermit(
      {
        ids: permit_ids,
        menu_id: [ menuModel.id ],
        code,
      },
      undefined,
      options,
    );
    if (permitModel) {
      return;
    }
  }
  throw await ns("{0} {1} 无权限", menuModel.lbl, code);
}
