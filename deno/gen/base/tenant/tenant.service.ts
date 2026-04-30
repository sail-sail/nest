import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  findAllDictbiz,
  createsDictbiz,
  deleteByIdsDictbiz,
} from "/gen/base/dictbiz/dictbiz.service.ts";

import {
  findAllOptbiz,
  createsOptbiz,
} from "/gen/base/optbiz/optbiz.service.ts";

import * as optbizDao from "/gen/base/optbiz/optbiz.dao.ts";

import * as tenantDao from "./tenant.dao.ts";

async function getSourceDictbizModels(
  source_tenant_id?: TenantId | null,
): Promise<DictbizModel[]> {
  if (!source_tenant_id) {
    return [ ];
  }
  const dictbiz_models = await findAllDictbiz(
    {
      tenant_id: source_tenant_id,
    },
  );
  return dictbiz_models;
}

async function getSourceOptbizModels(
  source_tenant_id?: TenantId | null,
): Promise<OptbizModel[]> {
  if (!source_tenant_id) {
    return [ ];
  }
  const optbiz_models = await findAllOptbiz(
    {
      tenant_id: source_tenant_id,
    },
  );
  return optbiz_models;
}

function intoNewDictbizDetailInput(
  dictbiz_detail_model: NonNullable<DictbizModel["dictbiz_detail"]>[number],
  tenant_id: TenantId,
): DictbizDetailInput {
  const dictbiz_detail_input = {
    ...dictbiz_detail_model,
    id: undefined,
    is_deleted: undefined,
    tenant_id,
    dictbiz_id: undefined,
    dictbiz_id_lbl: undefined,
    is_enabled_lbl: undefined,
    create_usr_id: undefined,
    create_usr_id_lbl: undefined,
    create_time: undefined,
    create_time_lbl: undefined,
    create_time_save_null: undefined,
    update_usr_id: undefined,
    update_usr_id_lbl: undefined,
    update_time: undefined,
    update_time_lbl: undefined,
    update_time_save_null: undefined,
  } as DictbizDetailInput;
  return dictbiz_detail_input;
}

function intoNewDictbizInput(
  dictbiz_model: DictbizModel,
  tenant_id: TenantId,
): DictbizInput {
  const dictbiz_input = {
    ...dictbiz_model,
    id: undefined,
    is_deleted: undefined,
    tenant_id,
    type_lbl: undefined,
    is_enabled_lbl: undefined,
    create_usr_id: undefined,
    create_usr_id_lbl: undefined,
    create_time: undefined,
    create_time_lbl: undefined,
    create_time_save_null: undefined,
    update_usr_id: undefined,
    update_usr_id_lbl: undefined,
    update_time: undefined,
    update_time_lbl: undefined,
    update_time_save_null: undefined,
    dictbiz_detail: (dictbiz_model.dictbiz_detail || [ ])
      .map((item) => intoNewDictbizDetailInput(item, tenant_id)),
  } as DictbizInput;
  return dictbiz_input;
}

function intoNewOptbizInput(
  optbiz_model: OptbizModel,
  tenant_id: TenantId,
): OptbizInput {
  const optbiz_input = {
    ...optbiz_model,
    id: undefined,
    is_deleted: undefined,
    tenant_id,
    is_locked_lbl: undefined,
    is_enabled_lbl: undefined,
    create_usr_id: undefined,
    create_usr_id_lbl: undefined,
    create_time: undefined,
    create_time_lbl: undefined,
    create_time_save_null: undefined,
    update_usr_id: undefined,
    update_usr_id_lbl: undefined,
    update_time: undefined,
    update_time_lbl: undefined,
    update_time_save_null: undefined,
    version: undefined,
  } as OptbizInput;
  return optbiz_input;
}

async function copyDictbizToTenants(
  source_dictbiz_models: DictbizModel[],
  tenant_ids: TenantId[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<void> {
  if (source_dictbiz_models.length === 0 || tenant_ids.length === 0) {
    return;
  }
  const dictbiz_inputs: DictbizInput[] = [ ];
  for (const tenant_id of tenant_ids) {
    for (const dictbiz_model of source_dictbiz_models) {
      dictbiz_inputs.push(
        intoNewDictbizInput(
          dictbiz_model,
          tenant_id,
        ),
      );
    }
  }
  await createsDictbiz(dictbiz_inputs, options);
}

async function copyOptbizToTenants(
  source_optbiz_models: OptbizModel[],
  tenant_ids: TenantId[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<void> {
  if (source_optbiz_models.length === 0 || tenant_ids.length === 0) {
    return;
  }
  const optbiz_inputs: OptbizInput[] = [ ];
  for (const tenant_id of tenant_ids) {
    for (const optbiz_model of source_optbiz_models) {
      optbiz_inputs.push(
        intoNewOptbizInput(
          optbiz_model,
          tenant_id,
        ),
      );
    }
  }
  await createsOptbiz(optbiz_inputs, options);
}

async function findDictbizIdsByTenantIds(
  tenant_ids: TenantId[],
): Promise<DictbizId[]> {
  const dictbiz_ids: DictbizId[] = [ ];
  for (const tenant_id of tenant_ids) {
    const dictbiz_models = await findAllDictbiz(
      {
        tenant_id,
      },
    );
    dictbiz_ids.push(...dictbiz_models.map((item) => item.id));
  }
  return dictbiz_ids;
}

async function findOptbizIdsByTenantIds(
  tenant_ids: TenantId[],
): Promise<OptbizId[]> {
  const optbiz_ids: OptbizId[] = [ ];
  for (const tenant_id of tenant_ids) {
    const optbiz_models = await findAllOptbiz(
      {
        tenant_id,
      },
    );
    optbiz_ids.push(...optbiz_models.map((item) => item.id));
  }
  return optbiz_ids;
}

async function deleteDictbizByTenantIds(
  tenant_ids: TenantId[],
): Promise<void> {
  const dictbiz_ids = await findDictbizIdsByTenantIds(tenant_ids);
  if (dictbiz_ids.length === 0) {
    return;
  }
  await deleteByIdsDictbiz(dictbiz_ids);
}

async function deleteOptbizByTenantIds(
  tenant_ids: TenantId[],
): Promise<void> {
  const optbiz_ids = await findOptbizIdsByTenantIds(tenant_ids);
  if (optbiz_ids.length === 0) {
    return;
  }
  await optbizDao.deleteByIdsOptbiz(optbiz_ids);
}

async function validateDeleteLastTenant(
  tenant_models: TenantModel[],
): Promise<void> {
  if (tenant_models.length === 0) {
    return;
  }
  const tenant_num = await tenantDao.findCountTenant();
  if (tenant_num <= tenant_models.length) {
    throw "最后一个租户不允许删除";
  }
}

async function setSearchQuery(
  _search: TenantSearch,
) {
  
}

/**
 * 根据条件查找租户总数
 */
export async function findCountTenant(
  search?: TenantSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_num = await tenantDao.findCountTenant(search);
  
  return tenant_num;
}

/**
 * 根据搜索条件和分页查找租户列表
 */
export async function findAllTenant(
  search?: TenantSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<TenantModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_models = await tenantDao.findAllTenant(search, page, sort);
  
  return tenant_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblTenant(
  input: TenantInput,
): Promise<void> {
  await tenantDao.setIdByLblTenant(input);
}

/**
 * 根据条件查找第一个租户
 */
export async function findOneTenant(
  search?: TenantSearch,
  sort?: SortInput[],
): Promise<TenantModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_model = await tenantDao.findOneTenant(search, sort);
  
  return tenant_model;
}

/**
 * 根据条件查找第一个租户, 如果不存在则抛错
 */
export async function findOneOkTenant(
  search?: TenantSearch,
  sort?: SortInput[],
): Promise<TenantModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_model = await tenantDao.findOneOkTenant(search, sort);
  
  return tenant_model;
}

/**
 * 根据 id 查找租户
 */
export async function findByIdTenant(
  tenant_id: TenantId,
): Promise<TenantModel | undefined> {
  
  const tenant_model = await tenantDao.findByIdTenant(tenant_id);
  
  return tenant_model;
}

/**
 * 根据 id 查找租户, 如果不存在则抛错
 */
export async function findByIdOkTenant(
  tenant_id: TenantId,
): Promise<TenantModel> {
  
  const tenant_model = await tenantDao.findByIdOkTenant(tenant_id);
  
  return tenant_model;
}

/**
 * 根据 ids 查找租户
 */
export async function findByIdsTenant(
  tenant_ids: TenantId[],
): Promise<TenantModel[]> {
  
  const tenant_models = await tenantDao.findByIdsTenant(tenant_ids);
  
  return tenant_models;
}

/**
 * 根据 ids 查找租户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTenant(
  tenant_ids: TenantId[],
): Promise<TenantModel[]> {
  
  const tenant_models = await tenantDao.findByIdsOkTenant(tenant_ids);
  
  return tenant_models;
}

/**
 * 根据搜索条件查找租户是否存在
 */
export async function existTenant(
  search?: TenantSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const tenant_exist = await tenantDao.existTenant(search);
  
  return tenant_exist;
}

/**
 * 根据 id 查找租户是否存在
 */
export async function existByIdTenant(
  tenant_id?: TenantId | null,
): Promise<boolean> {
  
  const tenant_exist = await tenantDao.existByIdTenant(tenant_id);
  
  return tenant_exist;
}

/**
 * 增加和修改时校验租户
 */
export async function validateTenant(
  input: TenantInput,
): Promise<void> {
  await tenantDao.validateTenant(input);
}

/**
 * 批量创建租户
 */
export async function createsTenant(
  inputs: TenantInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<TenantId[]> {
  const source_tenant_id = await getTenant_id();
  const source_dictbiz_models = await getSourceDictbizModels(source_tenant_id);
  const source_optbiz_models = await getSourceOptbizModels(source_tenant_id);

  const tenant_ids = await tenantDao.createsTenant(inputs, options);

  const created_tenant_ids = inputs
    .map((input) => input.id)
    .filter((tenant_id): tenant_id is TenantId => Boolean(tenant_id));

  await copyDictbizToTenants(
    source_dictbiz_models,
    created_tenant_ids,
    options,
  );
  await copyOptbizToTenants(
    source_optbiz_models,
    created_tenant_ids,
    options,
  );
  
  return tenant_ids;
}

/**
 * 根据 id 修改租户
 */
export async function updateByIdTenant(
  tenant_id: TenantId,
  input: TenantInput,
): Promise<TenantId> {
  
  const is_locked = await tenantDao.getIsLockedByIdTenant(tenant_id);
  if (is_locked) {
    throw "不能修改已经锁定的 租户";
  }
  
  tenant_id = await tenantDao.updateByIdTenant(tenant_id, input);
  
  return tenant_id;
}

/** 校验租户是否存在 */
export async function validateOptionTenant(
  model0?: TenantModel,
): Promise<TenantModel> {
  const tenant_model = await tenantDao.validateOptionTenant(model0);
  return tenant_model;
}

/**
 * 根据 ids 删除租户
 */
export async function deleteByIdsTenant(
  tenant_ids: TenantId[],
): Promise<number> {
  
  const old_models = await tenantDao.findByIdsTenant(tenant_ids);
  await validateDeleteLastTenant(old_models);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 租户";
    }
  }
  
  const tenant_num = await tenantDao.deleteByIdsTenant(tenant_ids);

  const deleted_tenant_ids = old_models.map((item) => item.id);
  await deleteDictbizByTenantIds(deleted_tenant_ids);
  await deleteOptbizByTenantIds(deleted_tenant_ids);

  return tenant_num;
}

/**
 * 根据 ids 启用或者禁用租户
 */
export async function enableByIdsTenant(
  ids: TenantId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const tenant_num = await tenantDao.enableByIdsTenant(ids, is_enabled);
  return tenant_num;
}

/**
 * 根据 ids 锁定或者解锁租户
 */
export async function lockByIdsTenant(
  tenant_ids: TenantId[],
  is_locked: 0 | 1,
): Promise<number> {
  const tenant_num = await tenantDao.lockByIdsTenant(tenant_ids, is_locked);
  return tenant_num;
}

/**
 * 根据 ids 还原租户
 */
export async function revertByIdsTenant(
  tenant_ids: TenantId[],
): Promise<number> {
  
  const tenant_num = await tenantDao.revertByIdsTenant(tenant_ids);
  
  return tenant_num;
}

/**
 * 根据 ids 彻底删除租户
 */
export async function forceDeleteByIdsTenant(
  tenant_ids: TenantId[],
): Promise<number> {
  
  const tenant_num = await tenantDao.forceDeleteByIdsTenant(tenant_ids);
  
  return tenant_num;
}

/**
 * 获取租户字段注释
 */
export async function getFieldCommentsTenant(): Promise<TenantFieldComment> {
  const tenant_fields = await tenantDao.getFieldCommentsTenant();
  return tenant_fields;
}

/**
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderByTenant(
  search?: TenantSearch,
): Promise<number> {
  
  const order_by = await tenantDao.findLastOrderByTenant(search);
  
  return order_by;
}
