import * as dict_detailDao from "./dict_detail.dao.ts";

/**
 * 获取 codes 对应的系统字典
 */
export async function getDict(
  codes: string[] = [ ],
) {
  return await dict_detailDao.getDict(codes);
}
