import { GqlOpt, gqlQuery } from "@/utils/graphql";

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
  return data?.menus;
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
