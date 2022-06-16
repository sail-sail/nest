import dayjs from "dayjs";
import { Background_taskModel, Background_taskSearch } from "./Model";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {Background_taskSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<Background_taskModel[]>}
 */
export async function findAll(
  search?: Background_taskSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<Background_taskModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: Background_taskSearch, $page: PageInput, $sort: [SortInput]) {
        findAllBackground_task(search: $search, page: $page, sort: $sort) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
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
  const data = rvData?.findAllBackground_task || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {Background_taskSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: Background_taskModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: Background_taskSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: Background_taskModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: Background_taskSearch, $page: PageInput, $sort: [SortInput]) {
        findAllBackground_task(search: $search, page: $page, sort: $sort) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
        findCountBackground_task(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const data = {
    data: rvData?.findAllBackground_task || [ ],
    count: rvData?.findCountBackground_task || 0,
  };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {Background_taskModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: Background_taskModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: Background_taskInput!) {
        createBackground_task(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createBackground_task;
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
  model: Background_taskModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: Background_taskInput!) {
        updateByIdBackground_task(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdBackground_task;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<Background_taskModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<Background_taskModel> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdBackground_task(id: $id) {
          id
          lbl
          state
          _state
          type
          _type
          result
          err_msg
          begin_time
          end_time
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const data = rvData?.findByIdBackground_task;
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
        deleteByIdsBackground_task(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsBackground_task;
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
        revertByIdsBackground_task(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsBackground_task;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {Background_taskSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: Background_taskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<string> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: Background_taskSearch, $sort: [SortInput]) {
        exportExcelBackground_task(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  return rvData?.exportExcelBackground_task || "";
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
        importFileBackground_task(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  return rvData?.importFileBackground_task || "";
}
