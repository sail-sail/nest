import * as dict_detailDao from "./dictbiz_detail.dao.ts";

/**
 * 获取 codes 对应的业务字典
 */
export async function getDictbiz(
  codes: string[] = [ ],
) {
  return await dict_detailDao.getDictbiz(codes);
}
