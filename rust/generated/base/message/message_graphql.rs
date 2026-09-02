
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

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::message_model::*;
use super::message_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct MessageGenQuery;

#[Object(rename_args = "snake_case")]
impl MessageGenQuery {
  
  /// 根据搜索条件和分页查找消息列表
  #[graphql(name = "findAllMessage")]
  async fn find_all_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<MessageModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_all_message(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找消息总数
  #[graphql(name = "findCountMessage")]
  async fn find_count_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_count_message(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个消息
  #[graphql(name = "findOneMessage")]
  async fn find_one_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<MessageModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_one_message(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个消息, 如果不存在则抛错
  #[graphql(name = "findOneOkMessage")]
  async fn find_one_ok_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<MessageModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_one_ok_message(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息
  #[graphql(name = "findByIdMessage")]
  async fn find_by_id_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageId,
  ) -> Result<Option<MessageModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_by_id_message(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息, 如果不存在则抛错
  #[graphql(name = "findByIdOkMessage")]
  async fn find_by_id_ok_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageId,
  ) -> Result<MessageModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_by_id_ok_message(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息
  #[graphql(name = "findByIdsMessage")]
  async fn find_by_ids_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageId>,
  ) -> Result<Vec<MessageModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_by_ids_message(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断消息是否存在
  #[graphql(name = "existsMessage")]
  async fn exists_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<MessageSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::exists_message(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找消息
  #[graphql(name = "findByIdsOkMessage")]
  async fn find_by_ids_ok_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageId>,
  ) -> Result<Vec<MessageModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        message_resolver::find_by_ids_ok_message(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取消息字段注释
  #[graphql(name = "getFieldCommentsMessage")]
  async fn get_field_comments_message(
    &self,
    ctx: &Context<'_>,
  ) -> Result<MessageFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        message_resolver::get_field_comments_message(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct MessageGenMutation;

#[Object(rename_args = "snake_case")]
impl MessageGenMutation {
  
  /// 创建消息
  #[graphql(name = "createsMessage")]
  async fn creates_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<MessageInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<MessageId>> {
    
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
        message_resolver::creates_message(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 消息根据id修改租户id
  #[graphql(name = "updateTenantByIdMessage")]
  async fn update_tenant_by_id_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_resolver::update_tenant_by_id_message(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改消息
  #[graphql(name = "updateByIdMessage")]
  async fn update_by_id_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: MessageId,
    #[graphql(name = "input")]
    input: MessageInput,
  ) -> Result<MessageId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_resolver::update_by_id_message(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除消息
  #[graphql(name = "deleteByIdsMessage")]
  async fn delete_by_ids_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_resolver::delete_by_ids_message(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原消息
  #[graphql(name = "revertByIdsMessage")]
  async fn revert_by_ids_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_resolver::revert_by_ids_message(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除消息
  #[graphql(name = "forceDeleteByIdsMessage")]
  async fn force_delete_by_ids_message(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<MessageId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        message_resolver::force_delete_by_ids_message(
          ids,
          None,
        )
      }).await
  }
  
}
