import {
  findOneMenu,
} from "/gen/base/menu/menu.dao.ts"

import {
  findAllDataPermit,
} from "/gen/base/data_permit/data_permit.dao.ts"

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
  validateIsEnabledUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findAllRole,
} from "/gen/base/role/role.dao.ts";

/**
 * 获取数据权限列表
 */
export async function getDataPermits(
  route_path: string,
  options?: {
    hasDataPermit?: boolean,
  },
) {
  if (!options?.hasDataPermit) {
    return [ ];
  }
  const authModel = await getAuthModel();
  if (!authModel) {
    return [ ];
  }
  const usr_id = authModel.id;
  
  const usr_model = await validateOptionUsr(
    await findByIdUsr(
      usr_id,
      {
        is_debug: false,
      },
    ),
  );
  await validateIsEnabledUsr(usr_model);
  
  const username = usr_model.username;
  const role_ids = usr_model.role_ids || [ ];
  
  if (username === "admin") {
    return [ ];
  }
  const menuModel = await findOneMenu(
    {
      route_path,
    },
    undefined,
    {
      is_debug: false,
    },
  );
  if (!menuModel) {
    return [ ];
  }
  
  const role_models = await findAllRole(
    {
      ids: role_ids,
    },
    undefined,
    undefined,
    {
      is_debug: false,
    },
  );
  
  let data_permit_ids = [ ];
  for (const role_model of role_models) {
    data_permit_ids.push(...role_model.data_permit_ids || [ ]);
  }
  data_permit_ids = Array.from(new Set(data_permit_ids));
  
  const dataPermitModels = await findAllDataPermit(
    {
      ids: data_permit_ids,
      menu_id: [ menuModel.id ],
    },
    undefined,
    undefined,
    {
      is_debug: false,
    },
  );
  return dataPermitModels;
}
