import type {
  Query,
} from "#/types.ts";

import {
  menuFields,
} from "@/views/base/menu/Model.ts";

import {
  roleFields,
} from "@/views/base/role/Model.ts";

/**
 * 查询菜单及其角色信息
 */
export async function findMenuAndRoles(
  search: MenuSearch,
  opt?: GqlOpt,
) {
  const res: {
    findMenuAndRoles: Query["findMenuAndRoles"];
  } = await query({
    query: `
      query($search: MenuSearch!) {
        findMenuAndRoles(search: $search) {
          menu_model {
            ${ menuFields.join(" ") }
          }
          role_models {
            ${ roleFields.join(" ") }
          }
        }
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const data = res.findMenuAndRoles;
  
  return data;
}
