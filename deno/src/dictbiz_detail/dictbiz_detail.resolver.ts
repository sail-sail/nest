import * as dictbiz_detailService from './dictbiz_detail.service.ts';

/**
 * 获取 codes 对应的业务字典
 */
export async function getDictbiz(
  codes: string[] = [ ],
) {
  return await dictbiz_detailService.getDictbiz(codes);
}
