import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
  validateIsEnabledUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findByIdsRole,
} from "/gen/base/role/role.dao.ts";

import {
  findAllFieldPermit,
} from "/gen/base/field_permit/field_permit.dao.ts";

import {
  findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

/** 字段权限 */
export async function getFieldPermit(
  route_path: string,
): Promise<string[] | null> {
  
  if (!route_path) {
    return null;
  }
  
  const options = {
    is_debug: false,
  };
  
  const usr_id = await get_usr_id(false);
  
  const usr_model = await validateOptionUsr(
    await findByIdUsr(
      usr_id,
      options,
    ),
  );
  await validateIsEnabledUsr(usr_model);
  
  const username = usr_model.username;
  
  if (username === "admin") {
    return null;
  }
  
  const menu_model = await findOneMenu(
    {
      route_path,
    },
    undefined,
    options,
  );
  
  if (!menu_model) {
    return null;
  }
  
  const menu_id = menu_model.id;
  
  const role_ids = usr_model.role_ids;
  
  const role_models = await findByIdsRole(
    role_ids,
    options,
  );
  
  let field_permit_ids = role_models.map((role_model) => {
    return role_model.field_permit_ids;
  }).flat();
  
  field_permit_ids = Array.from(new Set(field_permit_ids));
  
  const field_permit_models = await findAllFieldPermit(
    {
      ids: field_permit_ids,
      menu_id: [ menu_id ],
    },
    undefined,
    undefined,
    options,
  );
  
  const codes = field_permit_models.map((field_permit_model) => {
    return field_permit_model.code;
  });
  
  return codes;
}
