import type {
  Query,
} from "#/types.ts";

/** 获取当前用户的权限列表 */
export async function getUsrPermits(
  route_pathOrOpt?: string | GqlOpt,
  opt?: GqlOpt,
) {
  const route_path = typeof route_pathOrOpt === "string" ? route_pathOrOpt : undefined;
  const gqlOpt = typeof route_pathOrOpt === "string" ? opt : route_pathOrOpt;
  const res: {
    getUsrPermits: Query["getUsrPermits"],
  } = await query({
    query: /* GraphQL */ `
      query($route_path: String) {
        getUsrPermits(route_path: $route_path) {
          route_path
          code
        }
      }
    `,
    variables: route_path ? {
      route_path,
    } : undefined,
  }, gqlOpt);
  const data = res.getUsrPermits;
  return data;
}

/** 字段权限 */
export async function getFieldPermit(
  route_path: string,
  opt?: GqlOpt,
): Promise<string[] | null> {
  const res: {
    getFieldPermit: Query["getFieldPermit"],
  } = await query({
    query: /* GraphQL */ `
      query($route_path: String!) {
        getFieldPermit(route_path: $route_path)
      }
    `,
    variables: {
      route_path,
    },
  }, opt);
  const data = res.getFieldPermit;
  return data ?? null;
}
