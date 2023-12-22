import type {
  PtTypeSearch,
  PageInput,
  PtTypeModel as PtTypeModel0,
} from "#/types";

type PtTypeModel = PtTypeModel0 & {
  img_urls: string[];
};

/**
 * 根据搜索条件查找产品类别列表
 * @param {PtTypeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllPtType(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPtType: PtTypeModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPtType(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          is_recommend
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllPtType;
  for (let i = 0; i < res.length; i++) {
    const model = res[i];
    model.img_urls = model.img_urls || [ ];
    for (const img_id of model.img.split(",")) {
      if (!img_id) {
        continue;
      }
      const img_url = getImgUrl({
        id: img_id,
        width: 750,
      });
      model.img_urls.push(img_url || "");
    }
  }
  return res;
}
