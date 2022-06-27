import { Query } from "#/types.ts";
import dayjs from "dayjs";
import { PermitModel, PermitSearch } from "./Model";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

import { MenuModel, MenuSearch } from "../menu/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {PermitSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PermitSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result: Query.findAllMenu = data?.findAllPermit || [ ];
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {PermitSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllAndCount(
  search?: PermitSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
        findCountPermit(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = {
    data: data?.findAllPermit || [ ],
    count: data?.findCountPermit || 0,
  };
  for (let i = 0; i < result.data.length; i++) {
    const item = result.data[i];
  }
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {PermitModel} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PermitModel,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($model: PermitInput!) {
        createPermit(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result: Query.createMenu = data?.createPermit;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: PermitModel,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: PermitInput!) {
        updateByIdPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result: Query.updateByIdMenu = data?.updateByIdPermit;
  return result;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdPermit(id: $id) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Query.findByIdPermit = data?.findByIdPermit;
  return result;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Query.deleteByIdsPermit = data?.deleteByIdsPermit;
  return result;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Query.revertByIdsPermit = data?.revertByIdsPermit;
  return result;
}

export async function findAllAndCountMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result: {
    data: Query.findAllMenu,
    count: Query.findCountMenu,
  } = {
    data: data?.findAllMenu || [ ],
    count: data?.findCountMenu || 0,
  };
  return result;
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
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
  const result: Query.findAllMenu = data?.findAllMenu || [ ];
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {PermitSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: PermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: PermitSearch, $sort: [SortInput]) {
        exportExcelPermit(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query.exportExcelPermit = data?.exportExcelPermit || "";
  return result;
}

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
) {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!) {
        importFilePermit(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Query.importFilePermit = data?.importFilePermit || "";
  return result;
}
