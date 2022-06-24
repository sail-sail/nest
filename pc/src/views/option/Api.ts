import dayjs from "dayjs";
import { OptionModel, OptionSearch } from "./Model";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {OptionSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<OptionModel[]>}
 */
export async function findAll(
  search?: OptionSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<OptionModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: OptionSearch, $page: PageInput, $sort: [SortInput]) {
        findAllOption(search: $search, page: $page, sort: $sort) {
          id
          lbl
          key
          value
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
  const data = rvData?.findAllOption || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {OptionSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: OptionModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: OptionSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: OptionModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: OptionSearch, $page: PageInput, $sort: [SortInput]) {
        findAllOption(search: $search, page: $page, sort: $sort) {
          id
          lbl
          key
          value
          rem
        }
        findCountOption(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const data = {
    data: rvData?.findAllOption || [ ],
    count: rvData?.findCountOption || 0,
  };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {OptionModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: OptionModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: OptionInput!) {
        createOption(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createOption;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: OptionModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: OptionInput!) {
        updateByIdOption(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdOption;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<OptionModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<OptionModel> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdOption(id: $id) {
          id
          lbl
          key
          value
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const data = rvData?.findByIdOption;
  return data;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        deleteByIdsOption(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsOption;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        revertByIdsOption(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsOption;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {OptionSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: OptionSearch,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<string> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: OptionSearch, $sort: [SortInput]) {
        exportExcelOption(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  return rvData?.exportExcelOption || "";
}

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
): Promise<string> {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const rvData = await gqlQuery({
    query: gql`
      mutation($id: ID!) {
        importFileOption(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  return rvData?.importFileOption || "";
}
