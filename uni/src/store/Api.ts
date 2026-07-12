import type {
  Query,
} from "#/types.ts";

/** 获取当前用户的权限列表 */
export async function getUsrPermits(
  opt?: GqlOpt,
) {
  const res: {
    getUsrPermits: Query["getUsrPermits"],
  } = await query({
    query: /* GraphQL */ `
      query {
        getUsrPermits {
          route_path
          code
        }
      }
    `,
  }, opt);
  const data = res.getUsrPermits;
  return data;
}
