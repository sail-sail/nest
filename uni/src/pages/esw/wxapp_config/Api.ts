import type {
  WxappConfigSearch,
  WxappConfigModel as WxappConfigModel0,
} from "#/types";

type WxappConfigModel = WxappConfigModel0 & {
  img_urls: string[];
};

/**
 * 根据搜索条件查找第一个小程序配置
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
          val
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
