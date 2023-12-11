import type {
  WxappConfigSearch,
  WxappConfigModel as WxappConfigModel0,
  PtTypeSearch,
  PageInput,
  PtTypeModel as PtTypeModel0,
} from "#/types";

type WxappConfigModel = WxappConfigModel0 & {
  img_urls: string[];
};

type PtTypeModel = PtTypeModel0 & {
  img_urls: string[];
};

/**
 * 根据搜索条件查找第一个小程序配置
 * @export findOne
 * @param {WxappConfigSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxappConfigSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxappConfig: WxappConfigModel | undefined;
  } = await query({
    query: /* GraphQL */ `
      query($search: WxappConfigSearch, $sort: [SortInput!]) {
        findOneWxappConfig(search: $search, sort: $sort) {
          id
          img
          lbl
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxappConfig;
  if (model) {
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
  return model;
}

/**
 * 根据搜索条件查找产品类别列表
 * @export findAll
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
