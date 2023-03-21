import * as dict_detailService from './dict_detail.service.ts';

/**
 * 获取 codes 对应的系统字典
 */
export async function getDict(
  codes: string[] = [ ],
) {
  return await dict_detailService.getDict(codes);
}
