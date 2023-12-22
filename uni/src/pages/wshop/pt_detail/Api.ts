import type {
  PtSearch,
  PtModel as PtModel0,
} from "#/types";

export type PtModel = PtModel0 & {
  /** 图标 */
  img_urls: string[];
  /** 详情底部图片 */
  detail_bottom_img_urls: string[];
  /** 详情顶部图片 */
  detail_top_img_urls: string[];
};

/**
 * 根据搜索条件查找第一个产品
 * @param {PtSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOnePt(
  search?: PtSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePt?: PtModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $sort: [SortInput!]) {
        findOnePt(search: $search, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          is_new
          is_new_lbl
          introduct
          detail
          detail_top_img
          detail_bottom_img
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOnePt;
  if (model) {
    // 图标
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
    
    // 详情顶部图片
    model.detail_top_img_urls = model.detail_top_img_urls || [ ];
    for (const img_id of model.detail_top_img.split(",")) {
      if (!img_id) {
        continue;
      }
      const img_url = getImgUrl({
        id: img_id,
        width: 750,
      });
      model.detail_top_img_urls.push(img_url || "");
    }
    
    // 详情底部图片
    model.detail_bottom_img_urls = model.detail_bottom_img_urls || [ ];
    for (const img_id of model.detail_bottom_img.split(",")) {
      if (!img_id) {
        continue;
      }
      const img_url = getImgUrl({
        id: img_id,
        width: 750,
      });
      model.detail_bottom_img_urls.push(img_url || "");
    }
  }
  return model;
}
