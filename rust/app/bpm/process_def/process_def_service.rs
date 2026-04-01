use color_eyre::eyre::{
  Result,
  eyre,
};

use generated::base::usr::usr_model::UsrId;
use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
};
use generated::bpm::process_def::process_def_model::{
  ProcessDefId,
  ProcessDefInput,
};
use generated::bpm::process_def::process_def_service as process_def_gen_service;
use generated::bpm::process_revision::process_revision_model::{
  ProcessRevisionId,
  ProcessRevisionInput,
};
use generated::bpm::process_revision::process_revision_service as process_revision_gen_service;

pub async fn save_and_publishs_process_def(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  let publish_usr_id = get_auth_id_ok()?;
  let publish_time = get_now();

  let mut process_def_ids = Vec::with_capacity(inputs.len());
  for input in inputs {
    
    let process_def_id = save_process_def(
      input,
      options,
    ).await?;

    let process_revision_id = publish_process_revision(
      process_def_id,
      publish_usr_id,
      publish_time,
      options,
    ).await?;
    
    let current_revision_model = process_revision_gen_service::find_by_id_ok_process_revision(
      process_revision_id,
      options,
    ).await?;
    
    let current_revision_id_lbl = current_revision_model.lbl;
    
    process_def_gen_service::update_by_id_process_def(
      process_def_id,
      ProcessDefInput {
        current_revision_id: Some(process_revision_id),
        current_revision_id_lbl: Some(current_revision_id_lbl),
        ..Default::default()
      },
      options,
    ).await?;

    process_def_ids.push(process_def_id);
  }

  Ok(process_def_ids)
}

async fn save_process_def(
  input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefId> {
  if let Some(process_def_id) = input.id {
    let mut input = input;
    input.id = None;
    return process_def_gen_service::update_by_id_process_def(
      process_def_id,
      input,
      options,
    ).await;
  }

  let mut input = input;
  input.id = None;

  let process_def_ids = process_def_gen_service::creates_process_def(
    vec![input],
    options,
  ).await?;

  let process_def_id = process_def_ids.first().copied().ok_or_else(|| {
    eyre!("保存流程定义失败")
  })?;

  Ok(process_def_id)
}

async fn publish_process_revision(
  process_def_id: ProcessDefId,
  publish_usr_id: UsrId,
  publish_time: chrono::NaiveDateTime,
  options: Option<Options>,
) -> Result<ProcessRevisionId> {
  
  let process_def_model = process_def_gen_service::find_by_id_ok_process_def(
    process_def_id,
    options,
  ).await?;
  
  let usr_model = generated::base::usr::usr_service::find_by_id_ok_usr(
    publish_usr_id,
    options,
  ).await?;

  let process_revision_ids = process_revision_gen_service::creates_process_revision(
    vec![
      ProcessRevisionInput {
        process_def_id: Some(process_def_id),
        process_def_id_lbl: Some(process_def_model.lbl),
        graph_json: process_def_model.graph_json,
        publish_time: Some(publish_time),
        publish_usr_id: Some(publish_usr_id),
        publish_usr_id_lbl: Some(usr_model.lbl),
        ..Default::default()
      },
    ],
    options,
  ).await?;

  let process_revision_id = process_revision_ids.first().copied().ok_or_else(|| {
    eyre!("发布流程版本失败")
  })?;

  Ok(process_revision_id)
}