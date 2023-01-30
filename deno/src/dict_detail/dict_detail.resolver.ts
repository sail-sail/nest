import {
  _internals as dict_detailService,
} from './dict_detail.service.ts';

export const _internals = {
  getDict,
};

/**
 * 获取 codes 对应的系统字典
 */
async function getDict(
  codes: string[] = [ ],
) {
  return await dict_detailService.getDict(codes);
}
