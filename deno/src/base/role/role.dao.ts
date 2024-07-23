import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

/**
 * 获取当前用户拥有的角色id列表
 */
export async function getAuthRoleIds() {
  const auth_model = await getAuthModel(false);
  if (!auth_model) {
    return [ ];
  }
  const usr_model = await findByIdUsr(
    auth_model.id,
    {
      is_debug: false,
    },
  );
  if (!usr_model || !usr_model.is_enabled) {
    return [ ];
  }
  const role_ids = usr_model.role_ids || [ ];
  return role_ids;
}

/**
 * 获取用户拥有的角色id列表
 * @param {UsrId} usr_id
 */
export async function getRoleIds(
  usr_id?: UsrId,
) {
  const usr_model = await findByIdUsr(
    usr_id,
    {
      is_debug: false,
    },
  );
  if (!usr_model || !usr_model.is_enabled) {
    return [ ];
  }
  const role_ids = usr_model.role_ids || [ ];
  return role_ids;
}
