use tracing::instrument;
use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::domain_model::*;
use super::domain_resolver;


#[derive(Default)]
pub struct DomainGenQuery;

#[Object(rename_args = "snake_case")]
impl DomainGenQuery {
  
  /// 根据搜索条件和分页查找数据
  #[instrument(skip(self, ctx))]
  async fn find_all_domain<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DomainSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DomainModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  #[instrument(skip(self, ctx))]
  async fn find_count_domain<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DomainSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  #[instrument(skip(self, ctx))]
  async fn find_one_domain<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DomainSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DomainModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  #[instrument(skip(self, ctx))]
  async fn find_by_id_domain<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<DomainModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已启用
  /// 记录不存在则返回 false
  #[instrument(skip(self, ctx))]
  async fn get_is_enabled_by_id_domain<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::get_is_enabled_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  #[instrument(skip(self, ctx))]
  async fn get_is_locked_by_id_domain<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::get_is_locked_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  #[instrument(skip(self, ctx))]
  async fn get_field_comments_domain<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<DomainFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 查找 order_by 字段的最大值
  #[instrument(skip(self, ctx))]
  async fn find_last_order_by_domain<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<u32> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = domain_resolver::find_last_order_by(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct DomainGenMutation;

#[Object(rename_args = "snake_case")]
impl DomainGenMutation {
  
  /// 创建数据
  #[instrument(skip(self, ctx))]
  async fn create_domain<'a>(
    &self,
    ctx: &Context<'a>,
    model: DomainInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = domain_resolver::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  #[instrument(skip(self, ctx))]
  async fn update_by_id_domain<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: DomainInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  #[instrument(skip(self, ctx))]
  async fn delete_by_ids_domain<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 id 设置默认记录
  #[instrument(skip(self, ctx))]
  async fn default_by_id_domain<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::default_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 启用或禁用数据
  #[instrument(skip(self, ctx))]
  async fn enable_by_ids_domain<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_enabled: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::enable_by_ids(
      &mut ctx,
      ids,
      is_enabled,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 锁定或解锁数据
  #[instrument(skip(self, ctx))]
  async fn lock_by_ids_domain<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_locked: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::lock_by_ids(
      &mut ctx,
      ids,
      is_locked,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  #[instrument(skip(self, ctx))]
  async fn revert_by_ids_domain<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  #[instrument(skip(self, ctx))]
  async fn force_delete_by_ids_domain<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = domain_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
