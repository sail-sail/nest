import {
  type Query,
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

export function showUploadMsg(
  succNum: number,
  failNum: number,
  failErrMsgs: string[],
) {
  let msgArr: VNode[] = [ ];
  
  msgArr.push(
    h("div", { style: { color: "green" } }, `导入成功 ${ succNum } 条`),
  );
  msgArr.push(
    h("div", { style: { color: "red", marginTop: "4px", marginBottom: "4px" } }, `导入失败 ${ failNum } 条:`),
  );
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
