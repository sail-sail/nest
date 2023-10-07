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

use super::lang_model::*;
use super::lang_resolver;


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
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::find_all(
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
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::find_count(
      &mut ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_lang<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<LangSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<LangModel>> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::find_one(
      &mut ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_lang<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<LangModel>> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::find_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ID 查找是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_lang<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::get_is_enabled_by_id(
      &mut ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_lang<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<LangFieldComment> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::get_field_comments(
      &mut ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 查找 order_by 字段的最大值
  async fn find_last_order_by_lang<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<u32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = lang_resolver::find_last_order_by(
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
  async fn create_lang<'a>(
    &self,
    ctx: &Context<'a>,
    model: LangInput,
    unique_type: Option<UniqueType>,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    let id = lang_resolver::create(
      &mut ctx,
      model,
      options.into(),
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_lang<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: LangInput,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = lang_resolver::update_by_id(
      &mut ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = lang_resolver::delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 启用或禁用数据
  async fn enable_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
    is_enabled: u8,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = lang_resolver::enable_by_ids(
      &mut ctx,
      ids,
      is_enabled,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = lang_resolver::revert_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_lang<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    
    let res = lang_resolver::force_delete_by_ids(
      &mut ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
