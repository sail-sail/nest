
import type {
  Query,
} from "#/types.ts";

export async function getDict(
  codes: string[],
  opt?: GqlOpt,
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.notLoading = true;
  const data: {
    getDict: Query["getDict"];
  } = await query({
    query: /* GraphQL */ `
      query($codes: [String!]!) {
        getDict(codes: $codes) {
          id
          code
          type
          lbl
          val
        }
      }
    `,
    variables: {
      codes,
    },
  }, opt);
  const result = data.getDict;
  return result;
}

export async function getDictbiz(
  codes: string[],
  opt?: GqlOpt,
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.notLoading = true;
  const data: {
    getDictbiz: Query["getDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($codes: [String!]!) {
        getDictbiz(codes: $codes) {
          id
          code
          type
          lbl
          val
        }
      }
    `,
    variables: {
      codes,
    },
  }, opt);
  const result = data.getDictbiz;
  return result;
}

export function list2tree<
  R extends {
    id: any;
    lbl: string;
    parent_id: any;
  },
>(
  list: R[],
) {
  type T = R & {
    children: T[];
  };
  const treeData: T[] = [ ];
  function treeFn(parent_id: string, children: T[]) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const children2: T[] = [ ];
      if (item.parent_id === parent_id) {
        children.push({
          ...item,
          children: children2,
        });
      }
    }
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      item.children = item.children || [ ];
      treeFn(item.id, item.children);
    }
  }
  treeFn("", treeData);
  return treeData;
}
