
import type {
  Query,
} from "#/types.ts";

/** 小程序升级检测 */
export function appCheckUpgrade() {
  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    // console.log(res.hasUpdate);
  });

  updateManager.onUpdateReady(async function (res) {
    // const {
    //   confirm,
    // } = await uni.showModal({
    //   title: "更新提示",
    //   content: "新版本已经准备好，是否重启应用？",
    // });
    // if (confirm) {
    //   updateManager.applyUpdate();
    // }
    updateManager.applyUpdate();
  });

}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
    lbl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return treeData as T[];
}
