
import type {
  PageInput,
} from "#/types.ts";

import {
  compCnfQueryField,
} from "./Model.ts";

export async function setLblByIdCompCnf(
  model?: CompCnfModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找 组件配置 列表
 */
export async function findAllCompCnf(
  search?: CompCnfSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCompCnf: CompCnfModel[];
  } = await query({
    query: `
      query($search: CompCnfSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCompCnf(search: $search, page: $page, sort: $sort) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCompCnf;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdCompCnf(model);
  }
  return models;
}
