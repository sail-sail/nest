import type {
  Mutation,
  SetTenantAdminPwdInput,
} from "#/types";

/** 设置租户管理员密码 */
export async function setTenantAdminPwd(
  input?: SetTenantAdminPwdInput,
  opt?: GqlOpt,
) {
  const data: {
    setTenantAdminPwd: Mutation["setTenantAdminPwd"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation ($input: SetTenantAdminPwdInput!) {
        setTenantAdminPwd(input: $input)
      }
    `,
    variables: {
      input,
    },
  }, opt);
  const res = data.setTenantAdminPwd;
  return res;
}
