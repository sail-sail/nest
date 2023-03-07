import {
  _internals as optionsSrcDao,
} from "./options.dao.ts";

export const _internals = {
  getOptionsByLbl,
};

/**
 * 获取系统选项
 * @param lbl 
 */
async function getOptionsByLbl(
  lbl: string,
) {
  return await optionsSrcDao.getOptionsByLbl(lbl);
}
