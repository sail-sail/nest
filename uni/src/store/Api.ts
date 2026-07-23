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
      query($route_path: SmolStr) {
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
