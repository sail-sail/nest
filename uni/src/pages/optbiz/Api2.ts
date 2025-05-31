import type {
  Query,
} from "#/types";

/// 移动端是否发版中 uni_releasing
export async function getUniReleasing(
  opt?: GqlOpt,
) {
  const res: {
    getUniReleasing: boolean;
  } = await mutation({
    query: /* GraphQL */ `
      query {
        getUniReleasing
      }
    `,
  }, opt);
  const data = res.getUniReleasing;
  return data;
}
