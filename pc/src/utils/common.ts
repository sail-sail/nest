import type {
  Query,
} from "#/types";

export async function getDict(
  codes: string[],
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
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
  });
  const result = data.getDict;
  return result;
}

export async function getDictbiz(
  codes: string[],
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
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
  });
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
  

export function showUploadMsg(
  succNum: number,
  failNum: number,
  failErrMsgs: string[],
) {
  let msgArr: VNode[] = [ ];
  
  msgArr.push(
    h("div", { style: { color: "green" } }, `导入成功 ${ succNum } 条`),
  );
  if (failNum > 0) {
    msgArr.push(
      h("div", { style: { color: "red", marginTop: "4px", marginBottom: "4px" } }, `导入失败 ${ failNum } 条:`),
    );
  }
  for (let i = 0; i < failErrMsgs.length; i++) {
    msgArr.push(
      h("div", { style: { color: "gray", fontSize: "12px", marginTop: "4px" } }, failErrMsgs[i]),
    );
  }
  let msg: VNode | undefined = undefined;
  if (msgArr.length > 0) {
    msg = h("div", { style: { color: "red" } }, msgArr);
  }
  
  return {
    succNum,
    failNum,
    msg,
  };
}

export function copyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
