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
  } = await gqlQuery({
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
  } = await gqlQuery({
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
