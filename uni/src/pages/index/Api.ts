import type {
  Query,
  Mutation,
  MutationLoginArgs,
  RoleSearch,
  PageInput,
  GetLoginTenants,
} from "#/types";

import {
  parseUrl,
} from "@/utils/StringUtil.ts";

import cfg from "@/utils/config.ts";

import useUsrStore from "@/store/usr.ts";

const usrStore = useUsrStore();

/** 根据 当前网址的域名+端口 获取 租户列表 */
export async function getLoginTenants(
  variables: { domain: string },
  opt?: GqlOpt,
): Promise<GetLoginTenants[]> {
  const data: {
    getLoginTenants: Query["getLoginTenants"],
  } = await query({
    query: /* GraphQL */ `
      query($domain: SmolStr!) {
        getLoginTenants(domain: $domain) {
          id
          lbl
        }
      }
    `,
    variables,
  },opt);
  return data.getLoginTenants;
}

export async function login(
  input: MutationLoginArgs["input"],
  opt?: GqlOpt,
) {
  const res: {
    login: Mutation["login"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: LoginInput!) {
        login(input: $input) {
          usr_id
          username
          tenant_id
          org_id
          authorization
          lang
        }
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const data = res.login;
  return data;
}

export async function checkClientTenantId(): Promise<boolean> {
  let tenant_id: TenantId | null = uni.getStorageSync("client_tenant_id") as TenantId || null;
  if (tenant_id) {
    usrStore.setTenantId(tenant_id);
  }
  if (!cfg.appid) {
    // #ifdef H5
    const urlObj = parseUrl(location.href);
    if (urlObj.query?.tenant_id) {
      tenant_id = urlObj.query.tenant_id as TenantId;
      usrStore.setTenantId(tenant_id);
      uni.setStorageSync("client_tenant_id", tenant_id);
      return true;
    }
    // #endif
    if (cfg.client_tenant_id) {
      tenant_id = cfg.client_tenant_id as TenantId;
      usrStore.setTenantId(tenant_id);
      uni.setStorageSync("client_tenant_id", tenant_id);
      return true;
    }
    if (cfg.domain) {
      const tenant_models = await getLoginTenants(
        {
          domain: cfg.domain,
        },
        {
          notLoading: true,
        },
      );
      const tenant_model = tenant_models[0];
      tenant_id = tenant_model?.id;
      if (tenant_id) {
        usrStore.setTenantId(tenant_id);
        uni.setStorageSync("client_tenant_id", tenant_id);
        return true;
      }
      return false;
    }
    return false;
  }
  if (cfg.client_tenant_id) {
    tenant_id = cfg.client_tenant_id as TenantId;
    usrStore.setTenantId(tenant_id);
    uni.setStorageSync("client_tenant_id", tenant_id);
    return true;
  }
  let platform = "unknown";
  // #ifdef WEB
  const indexStore = useIndexStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork) {
    platform = "wechat";
  } else if (userAgent.isWechat) {
    platform = "wechat";
  } else if (userAgent.isPc) {
    platform = "pc";
  } else if (userAgent.isMobile) {
    platform = "h5";
  } else {
    platform = "h5";
  }
  // #endif
  // #ifdef MP-WEIXIN
  platform = "wechat";
  // #endif
  // #ifdef MP-ALIPAY
  platform = "alipay";
  // #endif
  // #ifdef MP-BAIDU
  platform = "baidu";
  // #endif
  // #ifdef MP-TOUTIAO
  platform = "toutiao";
  // #endif
  // #ifdef MP-LARK
  platform = "lark";
  // #endif
  // #ifdef MP-QQ
  platform = "qq";
  // #endif
  // #ifdef MP-KUAISHOU
  platform = "kuaishou";
  // #endif
  // #ifdef MP-JD
  platform = "jd";
  // #endif
  // #ifdef MP-360
  platform = "360";
  // #endif
  // #ifdef MP-HARMONY
  platform = "harmony";
  // #endif
  // #ifdef MP-XHS
  platform = "xhs";
  // #endif
  const data: {
    getTenantIdByAppid: Query["getTenantIdByAppid"];
  } = await query(
    {
      query: /* GraphQL */ `
        query($platform: SmolStr!, $appid: SmolStr!) {
          getTenantIdByAppid(platform: $platform, appid: $appid)
        }
      `,
      variables: {
        platform,
        appid: cfg.appid,
      },
    },
    {
      notLoading: true,
    },
  );
  tenant_id = data.getTenantIdByAppid;
  if (tenant_id) {
    usrStore.setTenantId(tenant_id);
    uni.setStorageSync("client_tenant_id", tenant_id);
    return true;
  }
  return false;
}

/**
 * 如果是 web 端
 * - 企业微信、微信 浏览器 需要立即检查是否登录
 * - 其他 浏览器 不需要检查
 * 如果是小程序
 * - 场景值为 1154 的不需要检查
 * - 其他场景值的需要检查
 * 其他平台不需要检查
 */
export async function checkLogin(
  options?: App.LaunchShowOption,
  opt?: GqlOpt,
): Promise<boolean> {
  opt = opt || { };
  opt.notLoading = true;
  opt.showErrMsg = false;
  let isChecklogin = true;
  // #ifdef WEB
  const indexStore = useIndexStore();
  const userAgent = indexStore.getUserAgent();
  if (userAgent.isWxwork) {
    isChecklogin = true;
  } else if (userAgent.isWechat) {
    isChecklogin = true;
  } else {
    isChecklogin = false;
  }
  // #endif
  if (options?.scene === 1154) {
    isChecklogin = false;
  } else if (!cfg.appid) {
    isChecklogin = false;
  }
  if (!isChecklogin) {
    return await checkClientTenantId();
  }
  const res: {
    checkLogin: Query["checkLogin"],
  } = await query({
    query: /* GraphQL */ `
      query {
        checkLogin
      }
    `,
  }, opt);
  const data = res?.checkLogin || false;
  return data;
}

// 清空缓存
export async function clearCache(
  opt?: GqlOpt,
) {
  const res: {
    clearCache: Mutation["clearCache"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation {
        clearCache
      }
    `,
  }, opt);
  const data = res.clearCache;
  return data;
}

/**
 * 根据搜索条件查找数据
 */
export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: Query["findAllRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          id
          lbl
          menu_ids
          menu_ids_lbl
          permit_ids
          permit_ids_lbl
          data_permit_ids
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllRole;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}
