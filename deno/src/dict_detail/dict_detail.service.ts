import {
  _internals as dict_detailDao,
} from "./dict_detail.dao.ts";

export const _internals = {
  getDict,
};

/**
 * 获取 codes 对应的系统字典
 */
async function getDict(
  codes: string[] = [ ],
) {
  return await dict_detailDao.getDict(codes);
}
