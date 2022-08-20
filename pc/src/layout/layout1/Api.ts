import { GqlOpt, gqlQuery } from "@/utils/graphql";

import {
  type MenuModel as MenuModel0,
} from "@/typings/types";

type MenuModel = MenuModel0 & {
  children?: MenuModel[];
  oldRoute_path?: string;
}

function treeMenusUrl(children: MenuModel[]) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i];
    if (item.route_path && (item.route_path.startsWith("http://") || item.route_path.startsWith("https://"))) {
      const path = item.route_path;
      item.oldRoute_path = path;
      item.route_path = `/myiframe?name=${ encodeURIComponent(item.lbl) }&src=${ encodeURIComponent(path) }`;
    }
    if (item.children && item.children.length > 0) {
      treeMenusUrl(item.children);
    }
  }
}

export async function getMenus(
  variables?: { type?: string },
  opt?: GqlOpt,
): Promise<any> {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($type: String) {
        menus: getMenus(type: $type) {
          id lbl route_path route_query children
        }
      }
    `,
    variables,
  }, opt);
  const result = data?.menus;
  if (result) {
    treeMenusUrl(result);
  }
  return result;
}

// 清空缓存
export async function clearCache(
  variables?: { [key: string]: any; },
  opt?: GqlOpt,
): Promise<any> {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation {
        clearCache
      }
    `,
    variables,
  }, opt);
  return data?.clearCache;
}
