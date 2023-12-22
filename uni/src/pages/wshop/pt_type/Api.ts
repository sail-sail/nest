import type {
  PtTypeSearch,
  PageInput,
  PtTypeModel as PtTypeModel0,
  PtSearch,
  PtModel as PtModel0,
} from "#/types";

type PtTypeModel = PtTypeModel0 & {
  img_urls: string[];
  ptModels: PtModel[];
};

type PtModel = PtModel0 & {
  /** 图标 */
  img_urls: string[];
  /** 详情底部图片 */
  detail_bottom_img_urls: string[];
  /** 详情顶部图片 */
  detail_top_img_urls: string[];
};

/**
 * 根据搜索条件查找产品类别列表
 * @param {PtTypeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllPtTypeAndPt(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const [
    ptTypeModels,
    ptModels,
  ] = await Promise.all([
    findAllPtType(search, page, sort, opt),
    findAllPt(undefined, undefined, undefined, opt),
  ]);
  for (const ptTypeModel of ptTypeModels) {
    ptTypeModel.ptModels = ptTypeModel.ptModels || [ ];
    for (const ptModel of ptModels) {
      const pt_type_ids = ptModel.pt_type_ids || [ ];
      if (pt_type_ids.includes(ptTypeModel.id)) {
        ptTypeModel.ptModels.push(ptModel);
      }
    }
  }
  return ptTypeModels;
}

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

/**
 * 根据搜索条件查找产品列表
 * @param {PtSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllPt(
  search?: PtSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPt: PtModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPt(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          is_new
          introduct
          detail
          detail_top_img
          detail_bottom_img
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllPt;
  for (let i = 0; i < res.length; i++) {
    const model = res[i];
    
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
  return res;
}
