import {
  findOne as findOneMenu,
} from "/gen/base/menu/menu.dao.ts"

import {
  findAll as findAllDataPermit,
} from "/gen/base/data_permit/data_permit.dao.ts"

/**
 * 获取数据权限列表
 */
export async function getDataPermits(
  route_path: string,
  options?: {
    notDataPermit?: boolean,
  },
) {
  if (options?.notDataPermit) {
    return [ ];
  }
  const menuModel = await findOneMenu({
    route_path,
  });
  if (!menuModel) {
    return [ ];
  }
  const dataPermitModels = await findAllDataPermit({
    menu_id: [ menuModel.id ],
  });
  return dataPermitModels;
}
