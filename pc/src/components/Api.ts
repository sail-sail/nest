import type {
  GetStatsOss,
} from "#/types"

/**
 * 获取附件信息列表, 包括文件名
 */
export async function getStatsOss(
  ids: string[],
  opt?: GqlOpt,
): Promise<{
  id: string,
  lbl: string,
  contentType?: string,
  size?: number,
}[]> {
  if (ids.length === 0) {
    return [ ];
  }
  const res: {
    getStatsOss: GetStatsOss[];
  } = await query({
    query: /* GraphQL */ `
      query($ids: [ID!]!) {
        getStatsOss(ids: $ids) {
          id
          lbl
          contentType
          size
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const data = res.getStatsOss;
  return data;
}

/**
 * 获取首页轮播图路由
 */
export async function getHomeUrls(
  opt?: GqlOpt,
): Promise<string[]> {
  const res = await query({
    query: /* GraphQL */ `
      query {
        getHomeUrls
      }
    `,
  }, opt);
  const data = res?.getHomeUrls || [ ];
  return data;
}
