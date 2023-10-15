use anyhow::Result;
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

use super::permit_model::*;
use super::permit_resolver;


#[derive(Default)]
pub struct PermitGenQuery;

#[Object(rename_args = "snake_case")]
impl PermitGenQuery {
  
  /// 根据搜索条件和分页查找数据
  async fn find_all_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<PermitModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::find_all(
      &ctx,
      search,
      page,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据搜索条件查询数据总数
  async fn find_count_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
  ) -> Result<i64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::find_count(
      &ctx,
      search,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据条件查找第一条数据
  async fn find_one_permit<'a>(
    &self,
    ctx: &Context<'a>,
    search: Option<PermitSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<PermitModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::find_one(
      &ctx,
      search,
      sort,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据ID查找第一条数据
  async fn find_by_id_permit<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<Option<PermitModel>> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::find_by_id(
      &ctx,
      id,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 获取字段对应的名称
  async fn get_field_comments_permit<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<PermitFieldComment> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::get_field_comments(
      &ctx,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}

#[derive(Default)]
pub struct PermitGenMutation;

#[Object(rename_args = "snake_case")]
impl PermitGenMutation {
  
  /// 创建数据
  async fn create_permit<'a>(
    &self,
    ctx: &Context<'a>,
    model: PermitInput,
    unique_type: Option<UniqueType>,
  ) -> Result<String> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    let id = permit_resolver::create(
      &ctx,
      model,
      options.into(),
    ).await;
    
    ctx.ok(id).await
  }
  
  /// 根据id修改数据
  async fn update_by_id_permit<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
    model: PermitInput,
  ) -> Result<String> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::update_by_id(
      &ctx,
      id,
      model,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 删除数据
  async fn delete_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::delete_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 还原数据
  async fn revert_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::revert_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 根据 ids 彻底删除数据
  async fn force_delete_by_ids_permit<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<u64> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::force_delete_by_ids(
      &ctx,
      ids,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}
