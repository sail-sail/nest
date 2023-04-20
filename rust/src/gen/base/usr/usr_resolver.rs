use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::usr_model::{UsrModel, UsrSearch};
use super::usr_service;


#[derive(Default)]
pub struct UsrResolver;

#[Object]
impl UsrResolver {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_usr<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<UsrSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
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
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
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
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let model = usr_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(model).await
  }
  
}
