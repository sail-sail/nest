use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};
use crate::common::gql::model::{PageInput, SortInput};

use super::lang_model::*;
use super::lang_service;


#[derive(Default)]
pub struct LangGenQuery;

#[Object(rename_args = "snake_case")]
impl LangGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_lang<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<LangSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<LangModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = lang_service::find_all(
      &mut ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_lang<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<LangSearch>,
  ) -> Result<i64> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = lang_service::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  pub async fn find_one_lang<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<LangSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<LangModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = lang_service::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  pub async fn find_by_id_lang<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<LangModel>> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = lang_service::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  pub async fn get_field_comments_lang<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<LangFieldComment> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = lang_service::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct LangGenMutation;

#[Object(rename_args = "snake_case")]
impl LangGenMutation {
  
  /// 创建数据
  pub async fn create_lang<'a>(
    &self,
    ctx: &Context<'a>,
    model: LangInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let id = lang_service::create(
      &mut ctx,
      model,
      None,
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  pub async fn update_by_id_lang<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: LangInput,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = lang_service::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  pub async fn delete_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = lang_service::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  pub async fn revert_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = lang_service::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  pub async fn force_delete_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    
    let res = lang_service::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
