import { renderExcel } from "ejsexcel";

import {
  initN,
  ns,
} from "/src/i18n/i18n.ts";

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
  type I18nModel,
  type I18nSearch,
} from "./i18n.model.ts";

import {
  _internals as i18nDao,
} from "./i18n.dao.ts";

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
  revertByIds,
  forceDeleteByIds,
  importFile,
  exportExcel,
};

/**
 * 根据条件查找总数
 * @param {I18nSearch} search? 搜索条件
 * @return {Promise<number>}
 */
async function findCount(
  search?: I18nSearch,
): Promise<number> {
  search = search || { };
  const data = await i18nDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {I18nSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<I18nModel[]>} 
 */
async function findAll(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<I18nModel[]> {
  search = search || { };
  const data: I18nModel[] = await i18nDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {I18nSearch} search? 搜索条件
 */
async function findOne(
  search?: I18nSearch,
) {
  search = search || { };
  const data = await i18nDao.findOne(search);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string | null,
) {
  const data = await i18nDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {I18nSearch} search? 搜索条件
 */
async function exist(
  search?: I18nSearch,
) {
  search = search || { };
  const data = await i18nDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
async function existById(
  id?: string | null,
) {
  const data = await i18nDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {I18nModel} model
 * @return {Promise<string>} id
 */
async function create(
  model: I18nModel,
): Promise<string> {
  const data = await i18nDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {I18nModel} model
 * @return {Promise<string>}
 */
async function updateById(
  id: string,
  model: I18nModel,
): Promise<string> {
  const data = await i18nDao.updateById(id, model);
  
  {
    const optionsSrcDao = (await import("/src/options/options.dao.ts"))._internals;
    await optionsSrcDao.updateI18n_version();
  }
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
  const data = await i18nDao.deleteByIds(ids);
  
  {
    const optionsSrcDao = (await import("/src/options/options.dao.ts"))._internals;
    await optionsSrcDao.updateI18n_version();
  }
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
  const data = await i18nDao.revertByIds(ids);
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
  const data = await i18nDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 导入文件
 * @param {string} id
 */
async function importFile(
  id: string,
) {
  const n = initN("/i18n");
  const header: { [key: string]: string } = {
    [ await n("语言") ]: "_lang_id",
    [ await n("菜单") ]: "_menu_id",
    [ await n("编码") ]: "code",
    [ await n("名称") ]: "lbl",
    [ await n("备注") ]: "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await i18nDao.create(model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await ns("第 {0} 行: {1}", (i + 1).toString(), err.message || err.toString()));
    }
  }
  
  let data = "";
  if (succNum > 0) {
    data = await ns("导入成功 {0} 条", succNum.toString());
    data += "\n";
  }
  if (failNum > 0) {
    data += await ns("导入失败 {0} 条", failNum.toString());
    data += "\n";
  }
  if (failErrMsgs.length > 0) {
    data += failErrMsgs.join("\n");
  }
  
  if (succNum > 0) {
    const optionsSrcDao = (await import("/src/options/options.dao.ts"))._internals;
    await optionsSrcDao.updateI18n_version();
  }
  
  return data;
}

/**
 * 导出Excel
 * @param {I18nSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
async function exportExcel(
  search?: I18nSearch,
  sort?: SortInput|SortInput[],
): Promise<string> {
  const n = initN("/i18n");
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`i18n.xlsx`);
  if (!buffer0) {
    const msg = await ns("模板文件 {0}.xlsx 不存在", "i18n");
    throw new ServiceException(msg);
  }
  const buffer = await renderExcel(buffer0, { models, n });
  const data = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: `${ await ns("国际化") }.xlsx`,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return data;
}
