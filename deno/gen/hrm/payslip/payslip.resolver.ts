import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PayslipInput,
  PayslipModel,
  PayslipSearch,
  PayslipFieldComment,
} from "./payslip.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountPayslip(
  search?: PayslipSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./payslip.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllPayslip(
  search?: PayslipSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<PayslipModel[]> {
  const { findAll } = await import("./payslip.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsPayslip(): Promise<PayslipFieldComment> {
  const { getFieldComments } = await import("./payslip.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOnePayslip(
  search?: PayslipSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<PayslipModel | undefined> {
  const { findOne } = await import("./payslip.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdPayslip(
  id: string,
): Promise<PayslipModel | undefined> {
  const { findById } = await import("./payslip.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createPayslip(
  input: PayslipInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    create,
  } = await import("./payslip.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/hrm/payslip",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdPayslip(
  id: string,
  input: PayslipInput,
): Promise<string> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/hrm/payslip",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./payslip.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsPayslip(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/hrm/payslip",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./payslip.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsPayslip(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsPayslip.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/hrm/payslip",
    "lock",
  );
  
  const {
    lockByIds,
  } = await import("./payslip.service.ts");
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsPayslip(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/hrm/payslip",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./payslip.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsPayslip(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/hrm/payslip",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./payslip.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
