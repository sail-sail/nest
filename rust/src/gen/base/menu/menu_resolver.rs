use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::menu_model::*;
use super::menu_service;


#[derive(Default)]
pub struct MenuGenQuery;

#[Object(rename_args = "snake_case")]
impl MenuGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_menu<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<MenuSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<MenuModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_menu<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<MenuSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_menu<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<MenuSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<MenuModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_menu<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<MenuModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_menu<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<MenuFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 查找 order_by 字段的最大值
  pub async fn find_last_order_by_menu<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = menu_service::find_last_order_by(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct MenuGenMutation;

#[Object(rename_args = "snake_case")]
impl MenuGenMutation {
  
  /// 创建数据
  pub async fn create_menu<'a>(
    &self,
    ctx: &Context<'a>,
    model: MenuInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = menu_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_menu<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: MenuInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = menu_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_menu<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = menu_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_menu<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = menu_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_menu<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = menu_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
