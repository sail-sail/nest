import { renderExcel } from "ejsexcel";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import {
  getTemplate,
  getImportFileRows,
} from "/lib/util/excel_util.ts";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type TenantModel,
  type TenantSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";
import * as tenantDao from "./tenant.dao.ts";

/**
 * 根据条件查找总数
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await tenantDao.findCount(search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<TenantModel[]>} 
 */
export async function findAll(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<TenantModel[]> {
  const result: TenantModel[] = await tenantDao.findAll(search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function findOne(
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const result: TenantModel | undefined = await tenantDao.findOne(search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string,
) {
  const result = await tenantDao.findById(id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function exist(
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  const result = await tenantDao.exist(search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id: string,
) {
  const result = await tenantDao.existById(id);
  return result;
}

/**
 * 创建数据
 * @param {TenantModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  model: TenantModel,
): Promise<string | undefined> {
  const result = await tenantDao.create(model);
  return result;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {TenantModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  id: string,
  model: TenantModel,
): Promise<string | undefined> {
  await tenantDao.updateById(id, model);
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  const result = await tenantDao.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const result = await tenantDao.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const result = await tenantDao.forceDeleteByIds(ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  id: string,
) {
  const header: { [key: string]: string } = {
    "名称": "lbl",
    "域名绑定": "host",
    "到期日": "expiration",
    "最大用户数": "max_usr_num",
    "启用": "_is_enabled",
    "菜单": "_menu_ids",
    "排序": "order_by",
    "备注": "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await tenantDao.create(model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(`第 ${ i + 1 } 行: ${ err.message || err.toString() }`);
    }
  }
  
  let result = "";
  if (succNum > 0) {
    result = `导入成功 ${ succNum } 条\n`;
  }
  if (failNum > 0) {
    result += `导入失败 ${ failNum } 条\n`;
  }
  if (failErrMsgs.length > 0) {
    result += failErrMsgs.join("\n");
  }
  
  return result;
}

/**
 * 导出Excel
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  search?: TenantSearch & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`tenant.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 tenant.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "租户.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const result = await tenantDao.findLastOrderBy();
  return result;
}
