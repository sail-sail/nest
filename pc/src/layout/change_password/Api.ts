import type {
  GetLoginInfo,
  ChangePasswordInput,
} from "#/types";

export async function getLoginInfo(
  opt?: GqlOpt,
) {
  const res: {
    getLoginInfo: GetLoginInfo;
  } = await query({
    query: /* GraphQL */ `
      query {
        getLoginInfo {
          lbl
          username
        }
      }
    `,
  }, opt);
  const data = res.getLoginInfo;
  return data;
}

/** 修改密码 */
export async function changePassword(
  input: ChangePasswordInput,
  opt?: GqlOpt,
) {
  const res: {
    changePassword: boolean;
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: ChangePasswordInput!) {
        changePassword(input: $input)
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const data = res.changePassword;
  return data;
}
