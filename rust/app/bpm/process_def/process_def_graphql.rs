use async_graphql::{Context, Object};
use color_eyre::eyre::Result;

use generated::common::context::Ctx;
use generated::bpm::process_def::process_def_model::{
  ProcessDefId,
  ProcessDefInput,
};

use super::process_def_resolver;

#[derive(Default)]
pub struct ProcessDefMutation;

#[Object(rename_args = "snake_case")]
impl ProcessDefMutation {
  /// 保存并发布流程
  #[graphql(name = "saveAndPublishsProcessDef")]
  async fn save_and_publishs_process_def(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<ProcessDefInput>,
  ) -> Result<Vec<ProcessDefId>> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        process_def_resolver::save_and_publishs_process_def(
          inputs,
          None,
        )
      }).await
  }
}