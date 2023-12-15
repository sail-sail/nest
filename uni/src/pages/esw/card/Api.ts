import type {
  Query,
  CardSearch,
  PageInput,
} from "#/types";

/**
 * 根据搜索条件查找第一个会员卡
 * @param {CardSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CardSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCard: Query["findOneCard"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardSearch, $sort: [SortInput!]) {
        findOneCard(search: $search, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          grade
          grade_lbl
          name
          mobile
          balance
          give_balance
          integral
          growth_amt
          is_default
          is_default_lbl
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneCard;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找会员卡列表
 * @param {CardSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: CardSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCard: Query["findAllCard"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCard(search: $search, page: $page, sort: $sort) {
          id
          lbl
          grade
          grade_lbl
          name
          mobile
          balance
          give_balance
          integral
          growth_amt
          is_default
          is_default_lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllCard;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}
