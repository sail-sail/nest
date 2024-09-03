import {
  findAll as findAllFieldPermit,
} from "/gen/base/field_permit/field_permit.dao.ts";

import {
  findOne as findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

// 字段权限
export async function getFieldPermit(
  route_path: string,
): Promise<string[]> {
  
  if (!route_path) {
    return [ ];
  }
  
  const options = {
    is_debug: false,
  };
  
  const menu_model = await findOneMenu(
    {
      route_path,
    },
    undefined,
    options,
  );
  
  if (!menu_model) {
    return [ ];
  }
  
  const menu_id = menu_model.id;
  
  const field_permit_models = await findAllFieldPermit(
    {
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
