import { Context } from "/lib/context.ts";
import { renderExcel } from "ejsexcel";
import { Page, Sort } from "/lib/page.model.ts";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import { getTemplate, getImportFileRows } from "/lib/excel_util.ts";
import { ServiceException } from "/lib/exceptions/service.exception.ts";

import { RoleModel, RoleSearch } from "/gen/types.ts";
import * as roleDao from "./role.dao.ts";

/**
 * 根据条件查找总数
 * @param {RoleSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: RoleSearch,
): Promise<number> {
  const result = await roleDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {RoleSearch} search? 搜索条件
 * @param {Page} page? 分页条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<RoleModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: RoleSearch,
  page?: Page,
  sort?: Sort|Sort[],
): Promise<RoleModel[]> {
  const result: RoleModel[] = await roleDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {RoleSearch} search? 搜索条件
 * @return {Promise<RoleModel>} 
 */
export async function findOne(
  context: Context,
  search?: RoleSearch,
): Promise<RoleModel> {
  const result = await roleDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<RoleModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<RoleModel | undefined> {
  const result = await roleDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {RoleSearch} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: RoleSearch,
): Promise<boolean> {
  const result = await roleDao.exist(context, search);
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
  const result = await roleDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {RoleModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: RoleModel,
): Promise<string | undefined> {
  const result = await roleDao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {RoleModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: RoleModel,
): Promise<string | undefined> {
  await roleDao.updateById(context, id, model);
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
  const result = await roleDao.deleteByIds(context, ids);
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
  const result = await roleDao.revertByIds(context, ids);
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
    "备注": "rem",
    "启用": "_is_enabled",
    "菜单": "_menu_ids",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await roleDao.create(context, model, { uniqueType: "update" });
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
 * @param {RoleSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: RoleSearch,
  sort?: Sort|Sort[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await getTemplate(`role.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 role.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "角色.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}
