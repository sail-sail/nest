import {
  type Query,
  type Mutation,
  type PageInput,
  type UsrCarsSearch,
  type UsrCarsInput,
} from "#/types";

import {
  type WxUsrSearch,
  type UsrSearch,
} from "#/types";

export async function findAllWxUsr(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxUsr: Query["findAllWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllWxUsr;
  return res;
}

export async function getWxUsrList() {
  const data = await findAllWxUsr(
    undefined,
    {
    },
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}
