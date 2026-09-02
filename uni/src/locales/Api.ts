import type {
  Query,
} from "#/types";

/**
 * 国际化
 */
export async function n0(
  langCode: string,
  routePath: string | null,
  code: string,
  opt?: GqlOpt,
) {
  const res: {
    n: Query["n"];
  } = await query({
    query: /* GraphQL */ `
      query($langCode: String!, $routePath: String, $code: String!) {
        n(langCode: $langCode, routePath: $routePath, code: $code)
      }
    `,
    variables: {
      langCode,
      routePath,
      code,
    },
  }, opt);
  const data = res.n;
  return data;
}
