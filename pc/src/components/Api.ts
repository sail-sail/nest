
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
  const rvData = await query({
    query: /* GraphQL */ `
      query($ids: [ID]!) {
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
  const data = rvData?.getStatsOss;
  return data;
}
