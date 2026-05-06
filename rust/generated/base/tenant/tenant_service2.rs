#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

use color_eyre::eyre::{Result, eyre};

use crate::common::context::{
  get_auth_tenant_id,
  Options,
};

use crate::base::dictbiz::dictbiz_model::{
  DictbizId,
  DictbizInput,
  DictbizModel,
  DictbizSearch,
};
use crate::base::dictbiz::dictbiz_service;
use crate::base::dictbiz_detail::dictbiz_detail_model::{
  DictbizDetailInput,
  DictbizDetailModel,
};
use crate::base::optbiz::optbiz_dao;
use crate::base::optbiz::optbiz_model::{
  OptbizId,
  OptbizInput,
  OptbizModel,
  OptbizSearch,
};
use crate::base::optbiz::optbiz_service;

use super::tenant_model::{
  TenantId,
  TenantInput,
  TenantSearch,
};
use super::tenant_service;

pub async fn creates_tenant(
  tenant_inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantId>> {
  let source_tenant_id = get_auth_tenant_id();
  let source_dictbiz_models = get_source_dictbiz_models(
    source_tenant_id,
    options,
  ).await?;
  let source_optbiz_models = get_source_optbiz_models(
    source_tenant_id,
    options,
  ).await?;

  let tenant_ids = tenant_service::creates_tenant(
    tenant_inputs,
    options,
  ).await?;

  copy_dictbiz_to_tenants(
    &source_dictbiz_models,
    &tenant_ids,
    options,
  ).await?;
  copy_optbiz_to_tenants(
    &source_optbiz_models,
    &tenant_ids,
    options,
  ).await?;

  Ok(tenant_ids)
}

pub async fn delete_by_ids_tenant(
  tenant_ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  validate_delete_last_tenant(
    &tenant_ids,
    options,
  ).await?;

  let num = tenant_service::delete_by_ids_tenant(
    tenant_ids.clone(),
    options,
  ).await?;

  delete_dictbiz_by_tenant_ids(
    &tenant_ids,
    options,
  ).await?;
  delete_optbiz_by_tenant_ids(
    &tenant_ids,
    options,
  ).await?;

  Ok(num)
}

async fn validate_delete_last_tenant(
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<()> {
  if tenant_ids.is_empty() {
    return Ok(());
  }

  let tenant_models = tenant_service::find_all_tenant(
    Some(TenantSearch {
      ids: Some(tenant_ids.to_vec()),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;

  if tenant_models.is_empty() {
    return Ok(());
  }

  let tenant_num = tenant_service::find_count_tenant(
    None,
    options,
  ).await?;

  if tenant_num <= tenant_models.len() as u64 {
    return Err(eyre!("最后一个租户不允许删除"));
  }

  Ok(())
}

async fn get_source_dictbiz_models(
  source_tenant_id: Option<TenantId>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  let Some(source_tenant_id) = source_tenant_id else {
    return Ok(vec![]);
  };

  dictbiz_service::find_all_dictbiz(
    Some(DictbizSearch {
      tenant_id: Some(source_tenant_id),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await
}

async fn get_source_optbiz_models(
  source_tenant_id: Option<TenantId>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  let Some(source_tenant_id) = source_tenant_id else {
    return Ok(vec![]);
  };

  optbiz_service::find_all_optbiz(
    Some(OptbizSearch {
      tenant_id: Some(source_tenant_id),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await
}

async fn copy_dictbiz_to_tenants(
  source_dictbiz_models: &[DictbizModel],
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<()> {
  if source_dictbiz_models.is_empty() || tenant_ids.is_empty() {
    return Ok(());
  }

  let mut dictbiz_inputs = Vec::with_capacity(
    source_dictbiz_models.len() * tenant_ids.len(),
  );
  for tenant_id in tenant_ids {
    for dictbiz_model in source_dictbiz_models {
      dictbiz_inputs.push(into_new_dictbiz_input(
        dictbiz_model,
        *tenant_id,
      ));
    }
  }

  dictbiz_service::creates_dictbiz(
    dictbiz_inputs,
    options,
  ).await?;

  Ok(())
}

async fn copy_optbiz_to_tenants(
  source_optbiz_models: &[OptbizModel],
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<()> {
  if source_optbiz_models.is_empty() || tenant_ids.is_empty() {
    return Ok(());
  }

  let mut optbiz_inputs = Vec::with_capacity(
    source_optbiz_models.len() * tenant_ids.len(),
  );
  for tenant_id in tenant_ids {
    for optbiz_model in source_optbiz_models {
      optbiz_inputs.push(into_new_optbiz_input(
        optbiz_model,
        *tenant_id,
      ));
    }
  }

  optbiz_service::creates_optbiz(
    optbiz_inputs,
    options,
  ).await?;

  Ok(())
}

async fn delete_dictbiz_by_tenant_ids(
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<()> {
  let dictbiz_ids = find_dictbiz_ids_by_tenant_ids(
    tenant_ids,
    options,
  ).await?;
  if dictbiz_ids.is_empty() {
    return Ok(());
  }

  dictbiz_service::delete_by_ids_dictbiz(
    dictbiz_ids,
    options,
  ).await?;

  Ok(())
}

async fn delete_optbiz_by_tenant_ids(
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<()> {
  let optbiz_ids = find_optbiz_ids_by_tenant_ids(
    tenant_ids,
    options,
  ).await?;
  if optbiz_ids.is_empty() {
    return Ok(());
  }

  optbiz_dao::delete_by_ids_optbiz(
    optbiz_ids,
    options,
  ).await?;

  Ok(())
}

async fn find_dictbiz_ids_by_tenant_ids(
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<Vec<DictbizId>> {
  let mut dictbiz_ids = Vec::new();

  for tenant_id in tenant_ids {
    let dictbiz_models = dictbiz_service::find_all_dictbiz(
      Some(DictbizSearch {
        tenant_id: Some(*tenant_id),
        ..Default::default()
      }),
      None,
      None,
      options,
    ).await?;
    dictbiz_ids.extend(
      dictbiz_models
        .into_iter()
        .map(|item| item.id),
    );
  }

  Ok(dictbiz_ids)
}

async fn find_optbiz_ids_by_tenant_ids(
  tenant_ids: &[TenantId],
  options: Option<Options>,
) -> Result<Vec<OptbizId>> {
  let mut optbiz_ids = Vec::new();

  for tenant_id in tenant_ids {
    let optbiz_models = optbiz_service::find_all_optbiz(
      Some(OptbizSearch {
        tenant_id: Some(*tenant_id),
        ..Default::default()
      }),
      None,
      None,
      options,
    ).await?;
    optbiz_ids.extend(
      optbiz_models
        .into_iter()
        .map(|item| item.id),
    );
  }

  Ok(optbiz_ids)
}

fn into_new_dictbiz_input(
  dictbiz_model: &DictbizModel,
  tenant_id: TenantId,
) -> DictbizInput {
  let mut dictbiz_input: DictbizInput = dictbiz_model.clone().into();

  dictbiz_input.id = None;
  dictbiz_input.is_deleted = None;
  dictbiz_input.tenant_id = Some(tenant_id);
  dictbiz_input.type_lbl = None;
  dictbiz_input.is_enabled_lbl = None;
  dictbiz_input.create_usr_id = None;
  dictbiz_input.create_usr_id_lbl = None;
  dictbiz_input.create_time = None;
  dictbiz_input.create_time_lbl = None;
  dictbiz_input.create_time_save_null = None;
  dictbiz_input.update_usr_id = None;
  dictbiz_input.update_usr_id_lbl = None;
  dictbiz_input.update_time = None;
  dictbiz_input.update_time_lbl = None;
  dictbiz_input.update_time_save_null = None;
  dictbiz_input.dictbiz_detail = Some(
    dictbiz_model.dictbiz_detail
      .iter()
      .map(|item|
        into_new_dictbiz_detail_input(
          item,
          tenant_id,
        )
      )
      .collect(),
  );

  dictbiz_input
}

fn into_new_dictbiz_detail_input(
  dictbiz_detail_model: &DictbizDetailModel,
  tenant_id: TenantId,
) -> DictbizDetailInput {
  let mut dictbiz_detail_input: DictbizDetailInput = dictbiz_detail_model.clone().into();

  dictbiz_detail_input.id = None;
  dictbiz_detail_input.is_deleted = None;
  dictbiz_detail_input.tenant_id = Some(tenant_id);
  dictbiz_detail_input.dictbiz_id = None;
  dictbiz_detail_input.dictbiz_id_lbl = None;
  dictbiz_detail_input.is_enabled_lbl = None;
  dictbiz_detail_input.create_usr_id = None;
  dictbiz_detail_input.create_usr_id_lbl = None;
  dictbiz_detail_input.create_time = None;
  dictbiz_detail_input.create_time_lbl = None;
  dictbiz_detail_input.create_time_save_null = None;
  dictbiz_detail_input.update_usr_id = None;
  dictbiz_detail_input.update_usr_id_lbl = None;
  dictbiz_detail_input.update_time = None;
  dictbiz_detail_input.update_time_lbl = None;
  dictbiz_detail_input.update_time_save_null = None;

  dictbiz_detail_input
}

fn into_new_optbiz_input(
  optbiz_model: &OptbizModel,
  tenant_id: TenantId,
) -> OptbizInput {
  let mut optbiz_input: OptbizInput = optbiz_model.clone().into();

  optbiz_input.id = None;
  optbiz_input.is_deleted = None;
  optbiz_input.tenant_id = Some(tenant_id);
  optbiz_input.is_locked_lbl = None;
  optbiz_input.is_enabled_lbl = None;
  optbiz_input.create_usr_id = None;
  optbiz_input.create_usr_id_lbl = None;
  optbiz_input.create_time = None;
  optbiz_input.create_time_lbl = None;
  optbiz_input.create_time_save_null = None;
  optbiz_input.update_usr_id = None;
  optbiz_input.update_usr_id_lbl = None;
  optbiz_input.update_time = None;
  optbiz_input.update_time_lbl = None;
  optbiz_input.update_time_save_null = None;
  optbiz_input.version = None;

  optbiz_input
}