
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  Options,
  UniqueType,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::message_receiver_model::*;
use super::message_receiver_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct MessageReceiverGenQuery;

#[Object(rename_args = "snake_case")]
impl MessageReceiverGenQuery {
  
  /// 根据搜索条件和分页查找消息接收人列表
  #[graphql(name = "findAllMessageReceiver")]
  async fn find_all_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageReceiverSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<MessageReceiverModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_all_message_receiver(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找消息接收人总数
  #[graphql(name = "findCountMessageReceiver")]
  async fn find_count_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageReceiverSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_count_message_receiver(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个消息接收人
  #[graphql(name = "findOneMessageReceiver")]
  async fn find_one_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageReceiverSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<MessageReceiverModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_one_message_receiver(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个消息接收人, 如果不存在则抛错
  #[graphql(name = "findOneOkMessageReceiver")]
  async fn find_one_ok_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageReceiverSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<MessageReceiverModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_one_ok_message_receiver(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息接收人
  #[graphql(name = "findByIdMessageReceiver")]
  async fn find_by_id_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageReceiverId,
  ) -> Result<Option<MessageReceiverModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_by_id_message_receiver(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息接收人, 如果不存在则抛错
  #[graphql(name = "findByIdOkMessageReceiver")]
  async fn find_by_id_ok_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageReceiverId,
  ) -> Result<MessageReceiverModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_by_id_ok_message_receiver(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息接收人
  #[graphql(name = "findByIdsMessageReceiver")]
  async fn find_by_ids_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageReceiverId>,
  ) -> Result<Vec<MessageReceiverModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_by_ids_message_receiver(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断消息接收人是否存在
  #[graphql(name = "existsMessageReceiver")]
  async fn exists_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageReceiverSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::exists_message_receiver(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息接收人
  #[graphql(name = "findByIdsOkMessageReceiver")]
  async fn find_by_ids_ok_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageReceiverId>,
  ) -> Result<Vec<MessageReceiverModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_receiver_resolver::find_by_ids_ok_message_receiver(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取消息接收人字段注释
  #[graphql(name = "getFieldCommentsMessageReceiver")]
  async fn get_field_comments_message_receiver(
    &self,
    ctx: &Context<'_>,
  ) -> Result<MessageReceiverFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        message_receiver_resolver::get_field_comments_message_receiver(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct MessageReceiverGenMutation;

#[Object(rename_args = "snake_case")]
impl MessageReceiverGenMutation {
  
  /// 创建消息接收人
  #[graphql(name = "createsMessageReceiver")]
  async fn creates_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<MessageReceiverInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<MessageReceiverId>> {
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .with_creating(Some(true))
      .build()
      .scope({
        message_receiver_resolver::creates_message_receiver(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 消息接收人根据id修改租户id
  #[graphql(name = "updateTenantByIdMessageReceiver")]
  async fn update_tenant_by_id_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageReceiverId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_receiver_resolver::update_tenant_by_id_message_receiver(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改消息接收人
  #[graphql(name = "updateByIdMessageReceiver")]
  async fn update_by_id_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageReceiverId,
    #[graphql(name = "input")]
    input: MessageReceiverInput,
  ) -> Result<MessageReceiverId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_receiver_resolver::update_by_id_message_receiver(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除消息接收人
  #[graphql(name = "deleteByIdsMessageReceiver")]
  async fn delete_by_ids_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageReceiverId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_receiver_resolver::delete_by_ids_message_receiver(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原消息接收人
  #[graphql(name = "revertByIdsMessageReceiver")]
  async fn revert_by_ids_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageReceiverId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_receiver_resolver::revert_by_ids_message_receiver(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除消息接收人
  #[graphql(name = "forceDeleteByIdsMessageReceiver")]
  async fn force_delete_by_ids_message_receiver(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageReceiverId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_receiver_resolver::force_delete_by_ids_message_receiver(
          ids,
          None,
        )
      }).await
  }
  
}
