use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::usr_model::*;
use super::usr_service;


#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
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
  
  /// 根据搜索条件查找总数
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
    
    let model = usr_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_usr<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<UsrModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let model = usr_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}

#[derive(Default)]
pub struct UsrMutation;

#[Object]
impl UsrMutation {
  
  /// 创建数据
  pub async fn create_usr<'a>(
    &self,
    ctx: &Context<'a>,
    input: UsrInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = usr_service::create(
      &mut ctx,
      input,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
}
