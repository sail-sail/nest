import { renderExcel } from "ejsexcel";

import {
  _internals as authDao
} from "/lib/auth/auth.dao.ts";

import {
  _internals as tmpfileDao
} from "/lib/tmpfile/tmpfile.dao.ts";

import {
  getTemplate,
  getImportFileRows,
} from "/lib/util/excel_util.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type UsrModel,
  type UsrSearch,
} from "./usr.model.ts";
import {
  _internals as usrDao,
} from "./usr.dao.ts";

export const _internals = {
  findCount,
  findAll,
  findOne,
  findById,
  exist,
  existById,
  create,
  updateById,
  deleteByIds,
  lockByIds,
  revertByIds,
  forceDeleteByIds,
  importFile,
  exportExcel,
};

/**
 * 根据条件查找总数
 * @param {UsrSearch} search? 搜索条件
 * @return {Promise<number>}
 */
async function findCount(
  search?: UsrSearch,
): Promise<number> {
  search = search || { };
  
  search.tenant_id = undefined;
  const data = await usrDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {UsrSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<UsrModel[]>} 
 */
async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<UsrModel[]> {
  search = search || { };
  
  search.tenant_id = undefined;
  const data: UsrModel[] = await usrDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {UsrSearch} search? 搜索条件
 */
async function findOne(
  search?: UsrSearch,
) {
  search = search || { };
  
  search.tenant_id = undefined;
  const data = await usrDao.findOne(search);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string | null,
) {
  const data = await usrDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {UsrSearch} search? 搜索条件
 */
async function exist(
  search?: UsrSearch,
) {
  search = search || { };
  
  search.tenant_id = undefined;
  const data = await usrDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
async function existById(
  id?: string | null,
) {
  const data = await usrDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {UsrModel} model
 * @return {Promise<string>} id
 */
async function create(
  model: UsrModel,
): Promise<string> {
  
  model.tenant_id = undefined;
  const data = await usrDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {UsrModel} model
 * @return {Promise<string>}
 */
async function updateById(
  id: string,
  model: UsrModel,
): Promise<string> {
  
  model.tenant_id = undefined;
  const data = await usrDao.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function deleteByIds(
  ids: string[],
): Promise<number> {
  const data = await usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await usrDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 导入文件
 * @param {string} id
 */
async function importFile(
  id: string,
) {
  const header: { [key: string]: string } = {
    "名称": "lbl",
    "用户名": "username",
    "密码": "password",
    "默认部门": "_default_dept_id",
    "启用": "_is_enabled",
    "备注": "rem",
    "拥有部门": "_dept_ids",
    "拥有角色": "_role_ids",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    
    model.tenant_id = undefined;
    try {
      await usrDao.create(model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(`第 ${ i + 1 } 行: ${ err.message || err.toString() }`);
    }
  }
  
  let data = "";
  if (succNum > 0) {
    data = `导入成功 ${ succNum } 条\n`;
  }
  if (failNum > 0) {
    data += `导入失败 ${ failNum } 条\n`;
  }
  if (failErrMsgs.length > 0) {
    data += failErrMsgs.join("\n");
  }
  
  return data;
}

/**
 * 导出Excel
 * @param {UsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
async function exportExcel(
  search?: UsrSearch,
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`usr.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 usr.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const data = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "用户.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return data;
}
