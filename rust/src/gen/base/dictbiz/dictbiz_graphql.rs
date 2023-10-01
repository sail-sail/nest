use anyhow::Result;
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  CtxImpl,
  Ctx,
  Options,
  UniqueType,
};

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::dictbiz_model::*;
use super::dictbiz_resolver;


#[derive(Default)]
pub struct DictbizGenQuery;

#[Object(rename_args = "snake_case")]
impl DictbizGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<DictbizSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<DictbizModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::get_is_enabled_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::get_is_locked_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<DictbizFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<u32> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = dictbiz_resolver::find_last_order_by(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct DictbizGenMutation;

#[Object(rename_args = "snake_case")]
impl DictbizGenMutation {
  
  /// 创建数据
  async fn create_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    model: DictbizInput,
    unique_type: Option<UniqueType>,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    let id = dictbiz_resolver::create(
      &mut ctx,
      model,
      options.into(),
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改租户id
  async fn update_tenant_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    tenant_id: String,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::update_tenant_by_id(
      &mut ctx,
      id,
      tenant_id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: DictbizInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_enabled: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::enable_by_ids(
      &mut ctx,
      ids,
      is_enabled,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_locked: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::lock_by_ids(
      &mut ctx,
      ids,
      is_locked,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = dictbiz_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
