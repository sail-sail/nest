import { gql, GqlOpt, gqlQuery } from "@/utils/graphql";

// 获取附件信息列表, 包括文件名
export async function getStatsMinio(
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
    query: gql`
      query($ids: [ID]!) {
        getStatsMinio(ids: $ids) {
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
  const data = rvData?.getStatsMinio;
  return data;
}
