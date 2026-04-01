use color_eyre::eyre::Result;
use smol_str::SmolStr;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};
use generated::common::permit::permit_service::use_permit;
use generated::bpm::process_def::process_def_model::{
  get_page_path_process_def,
  ProcessDefId,
  ProcessDefInput,
};
use generated::bpm::process_def::process_def_service as process_def_gen_service;

use super::process_def_service;

#[function_name::named]
pub async fn save_and_publishs_process_def(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  let mut inputs2 = Vec::with_capacity(inputs.len());
  for mut input in inputs {
    let process_def_id = input.id;
    input.id = None;
    let mut input = process_def_gen_service::set_id_by_lbl_process_def(
      input,
    ).await?;
    input.id = process_def_id;
    inputs2.push(input);
  }

  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("save_and_publishs"),
  ).await?;

  process_def_service::save_and_publishs_process_def(
    inputs2,
    options,
  ).await
}