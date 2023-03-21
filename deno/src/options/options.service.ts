import * as optionsSrcDao from "./options.dao.ts";

/**
 * 获取系统选项
 * @param lbl 
 */
export async function getOptionsByLbl(
  lbl: string,
) {
  return await optionsSrcDao.getOptionsByLbl(lbl);
}
