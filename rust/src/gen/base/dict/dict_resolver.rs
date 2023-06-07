use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::dict_model::*;
use super::dict_service;


#[derive(Default)]
pub struct DictGenQuery;

#[Object(rename_args = "snake_case")]
impl DictGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_dict<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_dict<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<DictModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  pub async fn get_is_locked_by_id_dict<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::get_is_locked_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_dict<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<DictFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 查找 order_by 字段的最大值
  pub async fn find_last_order_by_dict<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<u32> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dict_service::find_last_order_by(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct DictGenMutation;

#[Object(rename_args = "snake_case")]
impl DictGenMutation {
  
  /// 创建数据
  pub async fn create_dict<'a>(
    &self,
    ctx: &Context<'a>,
    model: DictInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = dict_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_dict<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: DictInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 锁定或者解锁数据
  pub async fn lock_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_locked: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::lock_by_ids(
      &mut ctx,
      ids,
      is_locked,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_dict<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dict_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
