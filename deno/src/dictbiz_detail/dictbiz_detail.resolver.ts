import {
  _internals as dictbiz_detailService,
} from './dictbiz_detail.service.ts';

export const _internals = {
  getDictbiz,
};

/**
 * 获取 codes 对应的业务字典
 */
async function getDictbiz(
  codes: string[] = [ ],
) {
  return await dictbiz_detailService.getDictbiz(codes);
}
