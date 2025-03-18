import type {
  GetDict,
  GetDictbiz,
  Query,
} from "#/types";

const dictCacheKey = "common.dictCache";

const dictCacheStr = localStorage.getItem(dictCacheKey);

let dictCacheObj: {
  [code: string]: GetDict[];
} | undefined;

try {
  dictCacheObj = dictCacheStr ? JSON.parse(dictCacheStr) : undefined;
} catch (err) {
  console.error(err);
  localStorage.removeItem(dictCacheKey);
}

export async function getDict(
  codes: string[],
  opt?: GqlOpt,
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
  const cacheCodes: string[] = [ ];
  const cacheResult: GetDict[][] = [ ];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const cacheItem = dictCacheObj?.[code];
    if (cacheItem) {
      cacheCodes.push(code);
      cacheResult.push(cacheItem);
    }
  }
  codes = codes.filter((code) => !cacheCodes.includes(code));
  if (codes.length === 0) {
    return cacheResult;
  }
  const res: {
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
  const data: GetDict[][] = res.getDict;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const item = data[i];
    dictCacheObj = dictCacheObj || { };
    dictCacheObj[code] = item;
  }
  localStorage.setItem(dictCacheKey, JSON.stringify(dictCacheObj));
  return data;
}

const dictbizCacheKey = "common.dictbizCache";

const dictbizCacheStr = localStorage.getItem(dictbizCacheKey);

let dictbizCacheObj: {
  [code: string]: GetDictbiz[];
} | undefined;

try {
  dictbizCacheObj = dictbizCacheStr ? JSON.parse(dictbizCacheStr) : undefined;
} catch (err) {
  console.error(err);
  localStorage.removeItem(dictbizCacheKey);
}

export async function getDictbiz(
  codes: string[],
  opt?: GqlOpt,
) {
  if (!codes || codes.length === 0) {
    return [ ];
  }
  const cacheCodes: string[] = [ ];
  const cacheResult: GetDictbiz[][] = [ ];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const cacheItem = dictbizCacheObj?.[code];
    if (cacheItem) {
      cacheCodes.push(code);
      cacheResult.push(cacheItem);
    }
  }
  codes = codes.filter((code) => !cacheCodes.includes(code));
  if (codes.length === 0) {
    return cacheResult;
  }
  const res: {
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
  const data: GetDictbiz[][] = res.getDictbiz;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const item = data[i];
    dictbizCacheObj = dictbizCacheObj || { };
    dictbizCacheObj[code] = item;
  }
  localStorage.setItem(dictbizCacheKey, JSON.stringify(dictbizCacheObj));
  return data;
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
  

export function showUploadMsg(
  succNum: number,
  failNum: number,
  failErrMsgs: string[],
) {
  const msgArr: VNode[] = [ ];
  
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

/**
 * 复制文本到剪贴板
 */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error(err);
  }
}

/**
 * 无token时自定义租户ID
 */
export function setClientTenantId(
  tenant_id_fn: () => TenantId | undefined,
) {
  watch(
    tenant_id_fn,
    () => {
      const tenant_id = tenant_id_fn();
      if (tenant_id) {
        sessionStorage.setItem("client_tenant_id", tenant_id);
      }
    },
    {
      immediate: true,
    },
  )
}
