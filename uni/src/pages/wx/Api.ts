import type {
  Query,
  Mutation,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  MutationBindWxUsrArgs,
} from "#/types";

import cfg from "@/utils/config";

export async function checkBindWxUsr() {
  // #ifndef H5
  {
    const res: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      checkBindWxUsr: Query["checkBindWxUsr"],
    } = await query({
      query: /* GraphQL */ `
        query {
          checkBindWxUsr
        }
      `,
    });
    const data = res.checkBindWxUsr;
    return data;
  }
  // #endif
  // #ifdef H5
  {
    const res: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      checkBindWxUsr: Query["checkBindWxUsr"],
    } = await query({
      query: /* GraphQL */ `
        query {
          checkBindWxUsr
        }
      `,
    });
    const data = res.checkBindWxUsr;
    return data;
  }
  // #endif
}

export async function bindWxUsr(
  input: MutationBindWxUsrArgs["input"],
  opt?: GqlOpt,
) {
  const res: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    bindWxUsr: Mutation["bindWxUsr"],
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: LoginInput!) {
        bindWxUsr(input: $input) {
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
  const data = res.bindWxUsr;
  return data;
}

/** 微信支付测试 */
export async function getTestPayOpt() {
  const appid = cfg.appid;
  const res: {
    getTestPayOpt: Mutation["getTestPayOpt"],
  } = await query({
    query: `
      mutation($appid: String!) {
        getTestPayOpt(appid: $appid) {
          out_trade_no
          timeStamp
          nonceStr
          package
          signType
          paySign
        }
      }
    `,
    variables: {
      appid,
    },
  });
  const data = res.getTestPayOpt;
  return data;
}
