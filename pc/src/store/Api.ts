import type {
  Query,
  QueryGetOptionsByLblArgs,
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

/** 字段权限 */
export async function getFieldPermit(
  route_path: string,
  opt?: GqlOpt,
): Promise<string[]> {
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
  return data;
}
