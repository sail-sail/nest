import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

// 角色
import {
  findByIdsRole,
} from "/gen/base/role/role.dao.ts";

/**
 * 获取当前用户拥有的角色列表
 * 未登录用户返回角色空数组
 */
export async function getAuthRoleModels(): Promise<RoleModel[]> {
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
  const role_models = await findByIdsRole(
    role_ids,
    {
      is_debug: false,
    },
  );
  return role_models;
}


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
  const usr_model = usr_id ? await findByIdUsr(
    usr_id,
    {
      is_debug: false,
    },
  ) : undefined;
  if (!usr_model || !usr_model.is_enabled) {
    return [ ];
  }
  const role_ids = usr_model.role_ids || [ ];
  return role_ids;
}
