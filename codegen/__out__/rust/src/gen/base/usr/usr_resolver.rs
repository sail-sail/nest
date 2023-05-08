use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::usr_model::*;
use super::usr_service;


#[derive(Default)]
pub struct UsrGenQuery;

#[Object(rename_args = "snake_case")]
impl UsrGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_usr<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<UsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_usr<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<UsrSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_usr<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<UsrSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<UsrModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_usr<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<UsrModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  pub async fn get_is_locked_by_id_usr<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::get_is_locked_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_usr<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<UsrFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct UsrGenMutation;

#[Object(rename_args = "snake_case")]
impl UsrGenMutation {
  
  /// 创建数据
  pub async fn create_usr<'a>(
    &self,
    ctx: &Context<'a>,
    model: UsrInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = usr_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改租户id
  pub async fn update_tenant_by_id_usr<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_usr<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: UsrInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_usr<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 锁定或者解锁数据
  pub async fn lock_by_ids_usr<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_locked: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::lock_by_ids(
      &mut ctx,
      ids,
      is_locked,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_usr<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_usr<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = usr_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
