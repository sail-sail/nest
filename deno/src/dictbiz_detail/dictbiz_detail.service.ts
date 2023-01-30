import {
  _internals as dict_detailDao,
} from "./dictbiz_detail.dao.ts";

export const _internals = {
  getDictbiz,
};

/**
 * 获取 codes 对应的业务字典
 */
async function getDictbiz(
  codes: string[] = [ ],
) {
  return await dict_detailDao.getDictbiz(codes);
}
