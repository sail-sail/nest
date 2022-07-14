import { type Context } from "/lib/context.ts";
import { renderExcel } from "ejsexcel";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { getTemplate, getImportFileRows } from "/lib/excel_util.ts";
import { ServiceException } from "/lib/exceptions/service.exception.ts";

import {
  type SearchExtra,
} from "/lib/dao_util.ts";

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
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await tenantDao.findCount(context, search);
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
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<TenantModel[]> {
  const result: TenantModel[] = await tenantDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<TenantModel>} 
 */
export async function findOne(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<TenantModel> {
  const result = await tenantDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<TenantModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<TenantModel | undefined> {
  const result = await tenantDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<boolean> {
  const result = await tenantDao.exist(context, search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 * @return {Promise<boolean>}
 */
export async function existById(
  context: Context,
  id: string,
): Promise<boolean> {
  const result = await tenantDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {TenantModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: TenantModel,
): Promise<string | undefined> {
  const result = await tenantDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {TenantModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: TenantModel,
): Promise<string | undefined> {
  await tenantDao.updateById(context, id, model);
  return id;
}

/**
 * 根据id列表删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await tenantDao.deleteByIds(context, ids);
  return result;
}

/**
 * 根据id列表还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await tenantDao.revertByIds(context, ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  context: Context,
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
      await tenantDao.create(context, model, { uniqueType: "update" });
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
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
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
  context: Context,
): Promise<number> {
  const result = await tenantDao.findLastOrderBy(context);
  return result;
}
