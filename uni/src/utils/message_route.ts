/**
 * 消息跳转: PC 端路由 -> uni 页面
 *
 * base_message 的 route_path / route_query 存的是 PC 端页面路径与参数, 如
 * /scrm/clue + {"id":"xxx","_tab_name":"线索名称"};
 * uni 端页面路径与参数键名都不同, 如 /pages/clue/ForeignTabs?clue_id=xxx&biz_lbl=线索名称,
 * 所以这里按表做一层映射转换, 转换不了返回 null, 由调用方提示不支持.
 */

/** uni 端跳转目标 */
type MessageRouteTarget = {
  /** 详情页路径 */
  page: string;
  /** 详情页的主键参数名, uni 端统一为 {表名}_id */
  idKey?: string;
  /** 列表页路径, 取不到主键时退化为列表页 */
  list?: string;
  /** 是否 详情 + 子列表 的标签页面(需要额外带 biz_lbl/tabGroup) */
  tabs?: boolean;
  /** 固定附加参数 */
  extra?: Record<string, string>;
};

/** PC 端路由 -> uni 端页面 */
const messageRouteMap: Record<string, MessageRouteTarget> = {
  // 线索
  "/scrm/clue": {
    page: "/pages/clue/ForeignTabs",
    idKey: "clue_id",
    list: "/pages/clue/List",
    tabs: true,
  },
  // 线索池
  "/scrm/clue/pool": {
    page: "/pages/clue/ForeignTabs",
    idKey: "clue_id",
    list: "/pages/clue/Pool",
    tabs: true,
    extra: {
      is_pool: "1",
    },
  },
  // 客户
  "/scrm/client": {
    page: "/pages/client/ForeignTabs",
    idKey: "client_id",
    list: "/pages/client/List",
    tabs: true,
  },
  // 公海客户
  "/scrm/client/pool": {
    page: "/pages/client/ForeignTabs",
    idKey: "client_id",
    list: "/pages/client/Pool",
    tabs: true,
    extra: {
      is_pool: "1",
    },
  },
  // 商机
  "/scrm/business": {
    page: "/pages/business/ForeignTabs",
    idKey: "business_id",
    list: "/pages/business/List",
    tabs: true,
  },
  // 借样单
  "/scrm/borrow_sample": {
    page: "/pages/borrow_sample/ForeignTabs",
    idKey: "borrow_sample_id",
    list: "/pages/borrow_sample/List",
    tabs: true,
  },
  // 订单
  "/scrm/order": {
    page: "/pages/order/ForeignTabs",
    idKey: "order_id",
    list: "/pages/order/List",
    tabs: true,
  },
  // 售前单
  "/scrm/presale": {
    page: "/pages/presale/ForeignTabs",
    idKey: "presale_id",
    list: "/pages/presale/List",
    tabs: true,
  },
  // 售后单
  "/scrm/after_sale": {
    page: "/pages/after_sale/ForeignTabs",
    idKey: "after_sale_id",
    list: "/pages/after_sale/List",
    tabs: true,
  },
  // 跟进记录
  "/scrm/follow": {
    page: "/pages/follow/Detail",
    idKey: "follow_id",
    list: "/pages/follow/List",
  },
  // 我的跟进
  "/scrm/myfollow": {
    page: "/pages/follow/MyList",
  },
  // 商机协作人
  "/scrm/business_collab": {
    page: "/pages/business_collab/Detail",
    idKey: "business_collab_id",
    list: "/pages/business_collab/List",
  },
  // 商机明细
  "/scrm/business_item": {
    page: "/pages/business_item/Detail",
    idKey: "business_item_id",
    list: "/pages/business_item/List",
  },
  // 类目
  "/scrm/category": {
    page: "/pages/category/Detail",
    idKey: "category_id",
    list: "/pages/category/List",
  },
  // 客户签到
  "/scrm/client_checkin": {
    page: "/pages/client_checkin/Detail",
    idKey: "client_checkin_id",
    list: "/pages/client_checkin/List",
  },
  // 联系人
  "/scrm/client_contact": {
    page: "/pages/client_contact/Detail",
    idKey: "client_contact_id",
    list: "/pages/client_contact/List",
  },
  // 竞品栏目
  "/scrm/competitor": {
    page: "/pages/competitor/Detail",
    idKey: "competitor_id",
    list: "/pages/competitor/List",
  },
  // 合同
  "/scrm/contract": {
    page: "/pages/contract/Detail",
    idKey: "contract_id",
    list: "/pages/contract/List",
  },
  // 订单明细
  "/scrm/order_item": {
    page: "/pages/order_item/Detail",
    idKey: "order_item_id",
    list: "/pages/order_item/List",
  },
  // 产品
  "/scrm/product": {
    page: "/pages/product/Detail",
    idKey: "product_id",
    list: "/pages/product/List",
  },
  // 收款单
  "/scrm/receipt": {
    page: "/pages/receipt/Detail",
    idKey: "receipt_id",
    list: "/pages/receipt/List",
  },
  // 收款关联订单
  "/scrm/receipt_order": {
    page: "/pages/receipt_order/Detail",
    idKey: "receipt_order_id",
    list: "/pages/receipt_order/List",
  },
  // 退款单
  "/scrm/refund": {
    page: "/pages/refund/Detail",
    idKey: "refund_id",
    list: "/pages/refund/List",
  },
  // 动态页面
  "/base/dyn_page": {
    page: "/pages/dyn_page/Detail",
    idKey: "dyn_page_id",
    list: "/pages/dyn_page/List",
  },
  // 动态页面数据
  "/base/dyn_page_data": {
    page: "/pages/dyn_page_data/Detail",
    idKey: "dyn_page_data_id",
    list: "/pages/dyn_page_data/List",
  },
  // 动态页面字段
  "/base/dyn_page_field": {
    page: "/pages/dyn_page_field/Detail",
    idKey: "dyn_page_field_id",
    list: "/pages/dyn_page_field/List",
  },
};

/** a=1&b=2 解析成对象 */
function parseQueryText(queryText: string) {
  const query: Record<string, string> = { };
  const pairs = queryText.split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (!pair) {
      continue;
    }
    const index = pair.indexOf("=");
    const key = index === -1 ? pair : pair.slice(0, index);
    const value = index === -1 ? "" : pair.slice(index + 1);
    if (!key) {
      continue;
    }
    try {
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    } catch (e) {
      query[key] = value;
    }
  }
  return query;
}

/** 对象参数统一转成字符串, 过滤空值 */
function normalizeQuery(query: Record<string, unknown>) {
  const result: Record<string, string> = { };
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = query[key];
    if (value == null || value === "") {
      continue;
    }
    result[key] = typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  }
  return result;
}

/** 解析 PC 端 route_query, 兼容 JSON 字符串 / a=1&b=2 / 对象 */
export function parsePcRouteQuery(
  routeQuery?: string | Record<string, unknown> | null,
) {
  if (!routeQuery) {
    return { } as Record<string, string>;
  }
  if (typeof routeQuery !== "string") {
    return normalizeQuery(routeQuery as Record<string, unknown>);
  }
  const queryText = routeQuery.trim();
  if (!queryText) {
    return { } as Record<string, string>;
  }
  if (queryText.startsWith("{")) {
    try {
      const queryObj = JSON.parse(queryText);
      if (queryObj && typeof queryObj === "object") {
        return normalizeQuery(queryObj as Record<string, unknown>);
      }
    } catch (e) {
      console.error("消息跳转参数解析失败:", e);
    }
    return { } as Record<string, string>;
  }
  return parseQueryText(queryText);
}

/** 拆分 PC 路由中可能自带的查询字符串 */
function splitRoutePath(routePath: string) {
  const index = routePath.indexOf("?");
  if (index === -1) {
    return {
      path: routePath.replace(/\/+$/, ""),
      query: { } as Record<string, string>,
    };
  }
  return {
    path: routePath.slice(0, index).replace(/\/+$/, ""),
    query: parseQueryText(routePath.slice(index + 1)),
  };
}

/** 逐级回退查找映射, 兼容 /scrm/clue/pool/detail 这类多级路径 */
function findRouteTarget(path: string) {
  let currentPath = path;
  while (currentPath) {
    const target = messageRouteMap[currentPath];
    if (target) {
      return target;
    }
    const index = currentPath.lastIndexOf("/");
    if (index <= 0) {
      return;
    }
    currentPath = currentPath.slice(0, index);
  }
}

/** 取记录主键, 优先 uni 参数名, 其次 PC 的 id, 最后任意 *_id */
function pickRecordId(
  query: Record<string, string>,
  idKey?: string,
) {
  if (idKey && query[idKey]) {
    return query[idKey];
  }
  if (query.id) {
    return query.id;
  }
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // _message_id 这类内部参数不是业务主键, 不能当记录 id 用
    if (key.startsWith("_")) {
      continue;
    }
    if (key.endsWith("_id") && query[key]) {
      return query[key];
    }
  }
  return "";
}

/** 拼接 uni 页面查询字符串 */
function buildQuery(
  query: Record<string, string | undefined>,
) {
  const params: string[] = [ ];
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = query[key];
    if (value == null || value === "") {
      continue;
    }
    params.push(`${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`);
  }
  if (params.length === 0) {
    return "";
  }
  return `?${ params.join("&") }`;
}

/**
 * PC 端路由 + 参数 -> uni 端跳转 url
 * 转换不了(移动端没有对应页面)返回 null
 */
export function buildUniRouteUrl(
  routePath?: string | null,
  routeQuery?: string | Record<string, unknown> | null,
) {
  const routePathStr = (routePath || "").trim();
  if (!routePathStr) {
    return null;
  }
  const {
    path,
    query: inlineQuery,
  } = splitRoutePath(routePathStr);
  if (!path.startsWith("/")) {
    return null;
  }
  const target = findRouteTarget(path);
  if (!target) {
    return null;
  }
  // 不需要主键的页面(如 我的跟进)
  if (!target.idKey) {
    return `${ target.page }${ buildQuery(target.extra || { }) }`;
  }

  const pcQuery = {
    ...parsePcRouteQuery(routeQuery),
    ...inlineQuery,
  };
  const id = pickRecordId(pcQuery, target.idKey);
  if (!id) {
    // 只有页面没有记录主键, 退化成列表页
    return target.list || target.page;
  }

  const query: Record<string, string | undefined> = {
    [target.idKey]: id,
  };
  const extraKeys = Object.keys(target.extra || { });
  for (let i = 0; i < extraKeys.length; i++) {
    const key = extraKeys[i];
    query[key] = target.extra?.[key];
  }
  if (target.tabs) {
    // PC 端用 _tab_name 做标签标题, uni 端标签页用 biz_lbl/title
    const tabName = pcQuery._tab_name || pcQuery.title || "";
    query.biz_lbl = tabName;
    query.title = tabName;
    query.tabGroup = "lbl";
  }

  return `${ target.page }${ buildQuery(query) }`;
}

/** 在跳转 url 上追加内部参数(如 _message_id) */
function appendExtraQuery(
  url: string | null,
  extraQuery?: Record<string, string>,
) {
  if (!url) {
    return null;
  }
  if (!extraQuery) {
    return url;
  }
  const params: string[] = [ ];
  const keys = Object.keys(extraQuery);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = extraQuery[key];
    if (value == null || value === "") {
      continue;
    }
    params.push(`${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`);
  }
  if (params.length === 0) {
    return url;
  }
  return `${ url }${ url.includes("?") ? "&" : "?" }${ params.join("&") }`;
}

/** 跳转到消息指定的 uni 页面, 转换不了或跳转失败会提示 */
export async function navigateToMessageRoute(
  routePath?: string | null,
  routeQuery?: string | Record<string, unknown> | null,
  extraQuery?: Record<string, string>,
) {
  const url = appendExtraQuery(buildUniRouteUrl(routePath, routeQuery), extraQuery);
  if (!url) {
    uni.showToast({
      title: "该消息暂不支持在移动端跳转",
      icon: "none",
    });
    return false;
  }
  try {
    await uni.navigateTo({
      url,
    });
    return true;
  } catch (e) {
    console.error(e);
    uni.showToast({
      title: "跳转失败, 页面不存在",
      icon: "none",
    });
    return false;
  }
}
