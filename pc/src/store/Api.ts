import {
  type Query,
  type QueryGetOptionsByLblArgs,
} from "#/types";

/**
 * 获取系统选项
 */
export async function getOptionsByLbl(
  variables: QueryGetOptionsByLblArgs,
  opt?: GqlOpt,
) {
  const res: {
    getOptionsByLbl: Query["getOptionsByLbl"],
  } = await query({
    query: /* GraphQL */ `
      query($lbl: String!) {
        getOptionsByLbl(lbl: $lbl) {
          id
          lbl
          ky
          val
        }
      }
    `,
    variables,
  }, opt);
  const data = res.getOptionsByLbl;
  return data;
}
