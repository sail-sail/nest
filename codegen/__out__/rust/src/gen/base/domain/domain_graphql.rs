#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};
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

use super::domain_model::*;
use super::domain_resolver;

#[derive(Default)]
pub struct DomainGenQuery;

#[Object(rename_args = "snake_case")]
impl DomainGenQuery {
  
  /// 根据搜索条件和分页查找域名列表
  async fn find_all_domain(
    &self,
    ctx: &Context<'_>,
    search: Option<DomainSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DomainModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找域名总数
  async fn find_count_domain(
    &self,
    ctx: &Context<'_>,
    search: Option<DomainSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个域名
  async fn find_one_domain(
    &self,
    ctx: &Context<'_>,
    search: Option<DomainSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DomainModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找域名
  async fn find_by_id_domain(
    &self,
    ctx: &Context<'_>,
    id: DomainId,
  ) -> Result<Option<DomainModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找域名
  async fn find_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
  ) -> Result<Vec<DomainModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找域名是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_domain(
    &self,
    ctx: &Context<'_>,
    id: DomainId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找域名是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_domain(
    &self,
    ctx: &Context<'_>,
    id: DomainId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取域名字段注释
  async fn get_field_comments_domain(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DomainFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        domain_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 域名 order_by 字段的最大值
  async fn find_last_order_by_domain(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        domain_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DomainGenMutation;

#[Object(rename_args = "snake_case")]
impl DomainGenMutation {
  
  /// 创建域名
  async fn creates_domain(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DomainInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DomainId>> {
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .with_creating(Some(true))
      .build()
      .scope({
        domain_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改域名
  async fn update_by_id_domain(
    &self,
    ctx: &Context<'_>,
    id: DomainId,
    input: DomainInput,
  ) -> Result<DomainId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除域名
  async fn delete_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 设置默认域名
  async fn default_by_id_domain(
    &self,
    ctx: &Context<'_>,
    id: DomainId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::default_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用域名
  async fn enable_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原域名
  async fn revert_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除域名
  async fn force_delete_by_ids_domain(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DomainId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        domain_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}
