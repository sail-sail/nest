import {
  useContext,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找微信支付通知总数
 */
export async function findCountWxPayNotice(
  search?: WxPayNoticeSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_pay_notice.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 */
export async function findAllWxPayNotice(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayNoticeModel[]> {
  
  const {
    findAll,
  } = await import("./wx_pay_notice.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldCommentsWxPayNotice(): Promise<WxPayNoticeFieldComment> {
  const { getFieldComments } = await import("./wx_pay_notice.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个微信支付通知
 */
export async function findOneWxPayNotice(
  search?: WxPayNoticeSearch,
  sort?: SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_pay_notice.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找微信支付通知
 */
export async function findByIdWxPayNotice(
  id: WxPayNoticeId,
): Promise<WxPayNoticeModel | undefined> {
  
  const {
    findById,
  } = await import("./wx_pay_notice.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 根据 ids 还原微信支付通知
 */
export async function revertByIdsWxPayNotice(
  ids: WxPayNoticeId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_pay_notice.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay_notice",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}
