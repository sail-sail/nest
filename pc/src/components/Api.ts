// 获取附件信息列表, 包括文件名
export async function getStatsOss(
  ids: string[],
  opt?: GqlOpt,
): Promise<{
  id: string,
  lbl: string,
  content_type: string,
}[]> {
  if (ids.length === 0) {
    return [ ];
  }
  const rvData = await gqlQuery({
    query: /* GraphQL */ `
      query($ids: [ID]!) {
        getStatsOss(ids: $ids) {
          id
          lbl
          content_type
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
